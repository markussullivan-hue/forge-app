// Ports createProject to a parameterised serverless function.
// Identity is the authenticated APP LOGIN: forgeUserId is the forge_users
// credential id captured at login (session.id). Org, domain user_id and the
// login email are resolved from it server-side — NOT from req.user.email.
//
// MUTATIVE: writes to `projects` and `project_delivery_models` in one txn.
//
// Each bind param is referenced exactly ONCE (Retool counts $N occurrences);
// values are bound in an `inputs` CTE and referenced by column name.
// UUID columns are cast explicitly — text->uuid is not an implicit cast.

type Params = {
  forgeUserId: string
  initiativeName: string
  initiativeDescription: string
  initiativeBudget: number | null
  initiativeTargetStartDate: string // 'YYYY-MM-DD'
  initiativeTargetEndDate: string // 'YYYY-MM-DD'
  serviceIndustryText: string
  radioGroupReadiness: string // 'Low' | 'Medium' | 'High'
  radioGroupScale: string
  radioGroupComplexity: string
  multiselectBusinessDrivers: string[]
  multiselectImpactedFunctions: string[]
  deliveryModelId: string
  selectLifeCycleStage: string // UUID phase_id, phase_name, or phase_code
  projectCode: string // PRJ-XXXXXXXX
}

type ReturnRow = {
  project_id: string
  org_id: string
  service_industry: string | null
  organisational_readiness: string | null
  delivery_maturity: string | null
  regulatory_intensity: string | null
  project_delivery_model_id: string
}

type ResolveRow = {
  org_id: string | null
  user_id: string | null
  user_email: string | null
  lifecycle_phase_id: string | null
}

export type CreateProjectResult = {
  projectId: string
  orgId: string
  serviceIndustry: string | null
  organisationalReadiness: string | null
  deliveryMaturity: string | null
  regulatoryIntensity: string | null
  projectDeliveryModelId: string
}

// Step 1: resolve identifiers from the login credential id. Each $N appears once (in `inputs`).
const RESOLVE_SQL = `
with inputs as (
  select
    nullif($1, '') as forge_user_id,
    nullif($2, '') as delivery_model_id_text,
    nullif($3, '') as lifecycle_input
)
select
  (
    select uor.org_id
    from forge_users fu
    join users u on u.user_id = fu.user_id
    join user_org_roles uor on uor.user_id = u.user_id
    cross join inputs i
    where fu.id = i.forge_user_id::uuid
      and fu.is_active = true
      and coalesce(u.is_active, true) = true
      and coalesce(uor.is_active, true) = true
    order by uor.assigned_at desc
    limit 1
  ) as org_id,
  (
    select fu.user_id
    from forge_users fu
    cross join inputs i
    where fu.id = i.forge_user_id::uuid
      and fu.is_active = true
    limit 1
  ) as user_id,
  (
    select fu.email
    from forge_users fu
    cross join inputs i
    where fu.id = i.forge_user_id::uuid
    limit 1
  ) as user_email,
  (
    select dmp.phase_id
    from delivery_model_phases dmp
    cross join inputs i
    where dmp.delivery_model_id = i.delivery_model_id_text::uuid
      and dmp.is_active = true
      and (
        (
          i.lifecycle_input ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
          and dmp.phase_id = i.lifecycle_input::uuid
        )
        or lower(dmp.phase_name) = lower(i.lifecycle_input)
        or lower(dmp.phase_code) = lower(i.lifecycle_input)
      )
    order by dmp.phase_order
    limit 1
  ) as lifecycle_phase_id
from inputs
`

// Step 2: guard-free write. UUID columns cast explicitly. Each $1..$17 once.
const INSERT_SQL = `
with i as (
  select
    nullif($1, '')::uuid                 as org_id,
    nullif($2, '')                       as project_code,
    nullif($3, '')                       as initiative_name,
    nullif($4, '')                       as initiative_description,
    nullif($5, '')                       as service_industry_text,
    nullif($6, '')::date                 as start_date,
    nullif($7, '')::date                 as end_date,
    nullif($8, '')::uuid                 as lifecycle_phase_id,
    nullif($9, '')                       as readiness,
    nullif($10, '')::numeric             as initiative_budget,
    $11::text[]                          as business_drivers,
    $12::text[]                          as impacted_functions,
    nullif($13, '')                      as scale,
    nullif($14, '')                      as complexity,
    nullif($15, '')::uuid                as created_by_user_id,
    nullif($16, '')                      as user_email,
    nullif($17, '')::uuid                as delivery_model_id
),
new_project as (
  insert into projects (
    org_id,
    project_code,
    project_name,
    description,
    service_industry,
    start_date,
    target_end_date,
    pipeline_stage,
    lifecycle_phase_id,
    status,
    delivery_maturity,
    regulatory_intensity,
    estimated_budget_gbp,
    business_drivers,
    impacted_functions,
    organisational_readiness,
    scale,
    complexity,
    entity_type,
    created_by_user_id,
    created_by_email_snapshot
  )
  select
    i.org_id,
    i.project_code,
    i.initiative_name,
    i.initiative_description,
    i.service_industry_text,
    i.start_date,
    i.end_date,
    'Not Started',
    i.lifecycle_phase_id,
    'Initiation',
    case
      when i.readiness = 'High' then 'High'
      when i.readiness = 'Low'  then 'Low'
      else 'Moderate'
    end,
    case
      when i.service_industry_text ~* '(financial|banking|insurance|health|pharma|public sector|government|defen[cs]e|aviation|nuclear|energ|utilit|telecom)' then 'High'
      when i.service_industry_text ~* '(retail|marketing|consult|hospitality|media|entertain)' then 'Low'
      else 'Medium'
    end,
    i.initiative_budget,
    i.business_drivers,
    i.impacted_functions,
    i.readiness,
    i.scale,
    i.complexity,
    'Project',
    i.created_by_user_id,
    i.user_email
  from i
  returning
    project_id,
    org_id,
    service_industry,
    organisational_readiness,
    delivery_maturity,
    regulatory_intensity
),
new_pdm as (
  insert into project_delivery_models (
    org_id,
    project_id,
    delivery_model_id,
    role,
    display_order
  )
  select
    np.org_id,
    np.project_id,
    i.delivery_model_id,
    'Primary',
    10
  from new_project np
  cross join i
  returning project_delivery_model_id
)
select
  np.project_id,
  np.org_id,
  np.service_industry,
  np.organisational_readiness,
  np.delivery_maturity,
  np.regulatory_intensity,
  pdm.project_delivery_model_id
from new_project np
cross join new_pdm pdm;
`

export default async function createProject(
  req: { params: Params; user: User },
): Promise<CreateProjectResult> {
  const p = req.params
  const forgeUserId = (p.forgeUserId ?? '').trim()

  if (forgeUserId === '') {
    throw new Error(
      'createProject: forgeUserId (login session id) is required but was empty',
    )
  }
  if ((p.deliveryModelId ?? '') === '') {
    throw new Error('createProject: deliveryModelId is required but was empty')
  }

  // 1) Resolve identifiers from the login credential.
  const resolved = await forgeSupabaseShadow2.query<ResolveRow>(RESOLVE_SQL, [
    forgeUserId,
    p.deliveryModelId ?? '',
    p.selectLifeCycleStage ?? '',
  ])

  const r = resolved.data[0]
  if (!r || r.org_id == null) {
    throw new Error('createProject: no active organisation resolved for this login')
  }
  if (r.lifecycle_phase_id == null) {
    throw new Error(
      `createProject: no active lifecycle phase matched deliveryModelId="${p.deliveryModelId}" lifecycleInput="${p.selectLifeCycleStage ?? ''}"`,
    )
  }
  // r.user_id may legitimately be null — preserves prior tolerance.

  // 2) Guard-free insert with resolved IDs.
  const result = await forgeSupabaseShadow2.query<ReturnRow>(INSERT_SQL, [
    r.org_id, // $1
    p.projectCode ?? '', // $2
    p.initiativeName ?? '', // $3
    p.initiativeDescription ?? '', // $4
    p.serviceIndustryText ?? '', // $5
    p.initiativeTargetStartDate ?? '', // $6
    p.initiativeTargetEndDate ?? '', // $7
    r.lifecycle_phase_id, // $8
    p.radioGroupReadiness ?? '', // $9
    p.initiativeBudget == null ? '' : String(p.initiativeBudget), // $10
    p.multiselectBusinessDrivers ?? [], // $11
    p.multiselectImpactedFunctions ?? [], // $12
    p.radioGroupScale ?? '', // $13
    p.radioGroupComplexity ?? '', // $14
    r.user_id ?? '', // $15
    r.user_email ?? '', // $16
    p.deliveryModelId ?? '', // $17
  ])

  const row = result.data[0]
  if (!row) {
    throw new Error(
      'createProject: INSERT returned no rows despite resolved preconditions (investigate constraint/trigger failure)',
    )
  }

  return {
    projectId: row.project_id,
    orgId: row.org_id,
    serviceIndustry: row.service_industry,
    organisationalReadiness: row.organisational_readiness,
    deliveryMaturity: row.delivery_maturity,
    regulatoryIntensity: row.regulatory_intensity,
    projectDeliveryModelId: row.project_delivery_model_id,
  }
}