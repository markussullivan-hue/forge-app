// Ports createProjectContext to a parameterised serverless function.
// Actor identity is the authenticated APP LOGIN (forgeUserId / session.id),
// resolved via forge_users — NOT req.user.email.
//
// MUTATIVE: inserts into project_context.

type Params = {
  forgeUserId: string
  projectId: string
  orgId: string
  textInputBusinessProblem: string
  textInputStrategicObjectives: string // multiline; classic splits on \r?\n
  explicitOutOfScopeInput: string
  knownDependenciesInput: string
  keyAssumptionsInput: string
  keyConstraintsInput: string
  resourceModelSelect: string | null
  keyRolesRequiredMultiselect: string[]
  stakeholderGroupsMultiselect: string[]
  budgetConfidenceSelect: string | null
  budgetNotesInput: string
  qualityAssuranceExpectationsInput: string
  checkboxGroupPOTIProcesses: string[]
  checkboxGroupPOTIOrganisation: string[]
  checkboxGroupPOTITechnology: string[]
  checkboxGroupPOTIInformation: string[]
  deliveryModelGroupSelect: string | null
  preferredDeliveryModelSelect: string | null
  deliveryModelCustomInput: string
}

type ReturnRow = {
  context_id: string
  project_id: string
  org_id: string
}

export type CreateProjectContextResult = {
  contextId: string
  projectId: string
  orgId: string
}

const SQL = `
with inputs as (
  select
    nullif($1, '')::uuid          as org_id,
    nullif($2, '')::uuid          as project_id,
    nullif($3, '')                as business_problem,
    coalesce($4, '')              as strategic_objectives_text,
    nullif($5, '')                as explicit_out_of_scope,
    nullif($6, '')                as known_dependencies,
    nullif($7, '')                as key_assumptions,
    nullif($8, '')                as key_constraints,
    nullif($9, '')                as resource_model,
    $10::text[]                   as key_roles_required,
    $11::text[]                   as stakeholder_groups,
    nullif($12, '')               as budget_confidence,
    nullif($13, '')               as budget_notes,
    nullif($14, '')               as qa_expectations,
    $15::text[]                   as scope_processes,
    $16::text[]                   as scope_organisation,
    $17::text[]                   as scope_technology,
    $18::text[]                   as scope_information,
    nullif($19, '')::uuid         as delivery_model_group_id,
    nullif($20, '')::uuid         as delivery_model_id,
    nullif($21, '')               as delivery_model_custom,
    nullif($22, '')               as forge_user_id
),
objectives as (
  select array(
    select trim(x)
    from regexp_split_to_table((select strategic_objectives_text from inputs), E'\\\\r?\\\\n') as x
    where trim(x) <> ''
  ) as arr
),
poti_summary as (
  select coalesce(array_agg(v), ARRAY[]::text[]) as scope_poti
  from (
    select 'Processes'::text as v
      where coalesce(array_length((select scope_processes from inputs), 1), 0) > 0
    union all
    select 'Organisation'::text
      where coalesce(array_length((select scope_organisation from inputs), 1), 0) > 0
    union all
    select 'Technology'::text
      where coalesce(array_length((select scope_technology from inputs), 1), 0) > 0
    union all
    select 'Information'::text
      where coalesce(array_length((select scope_information from inputs), 1), 0) > 0
  ) p
),
actor as (
  select fu.user_id, fu.email
  from forge_users fu
  cross join inputs i
  where fu.id = i.forge_user_id::uuid
    and fu.is_active = true
  limit 1
)
insert into project_context (
  org_id,
  project_id,
  business_problem,
  strategic_objectives,
  explicit_out_of_scope,
  known_dependencies,
  key_assumptions,
  key_constraints,
  resource_model,
  key_roles_required,
  stakeholder_groups,
  budget_confidence,
  budget_notes,
  quality_assurance_expectations,
  scope_poti,
  scope_processes,
  scope_organisation,
  scope_technology,
  scope_information,
  delivery_model_group_id,
  delivery_model_id,
  delivery_model_custom,
  created_by_email_snapshot,
  updated_by_email_snapshot,
  created_by_user_id,
  updated_by_user_id
)
select
  i.org_id,
  i.project_id,
  i.business_problem,
  (select arr from objectives),
  i.explicit_out_of_scope,
  i.known_dependencies,
  i.key_assumptions,
  i.key_constraints,
  i.resource_model,
  i.key_roles_required,
  i.stakeholder_groups,
  i.budget_confidence,
  i.budget_notes,
  i.qa_expectations,
  (select scope_poti from poti_summary),
  i.scope_processes,
  i.scope_organisation,
  i.scope_technology,
  i.scope_information,
  i.delivery_model_group_id,
  i.delivery_model_id,
  i.delivery_model_custom,
  (select email from actor),
  (select email from actor),
  (select user_id from actor),
  (select user_id from actor)
from inputs i
returning context_id, project_id, org_id;
`

export default async function createProjectContext(
  req: { params: Params; user: User },
): Promise<CreateProjectContextResult> {
  const p = req.params
  const forgeUserId = (p.forgeUserId ?? '').trim()

  const result = await forgeSupabaseShadow2.query<ReturnRow>(SQL, [
    p.orgId ?? '',
    p.projectId ?? '',
    p.textInputBusinessProblem ?? '',
    p.textInputStrategicObjectives ?? '',
    p.explicitOutOfScopeInput ?? '',
    p.knownDependenciesInput ?? '',
    p.keyAssumptionsInput ?? '',
    p.keyConstraintsInput ?? '',
    p.resourceModelSelect ?? '',
    p.keyRolesRequiredMultiselect ?? [],
    p.stakeholderGroupsMultiselect ?? [],
    p.budgetConfidenceSelect ?? '',
    p.budgetNotesInput ?? '',
    p.qualityAssuranceExpectationsInput ?? '',
    p.checkboxGroupPOTIProcesses ?? [],
    p.checkboxGroupPOTIOrganisation ?? [],
    p.checkboxGroupPOTITechnology ?? [],
    p.checkboxGroupPOTIInformation ?? [],
    p.deliveryModelGroupSelect ?? '',
    p.preferredDeliveryModelSelect ?? '',
    p.deliveryModelCustomInput ?? '',
    forgeUserId,
  ])

  const row = result.data[0]
  if (!row) throw new Error('createProjectContext returned no rows')
  return {
    contextId: row.context_id,
    projectId: row.project_id,
    orgId: row.org_id,
  }
}