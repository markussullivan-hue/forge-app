// Dashboard: Risks & Assurance (read-only).
// Mirrors /context/linked-classic-app/lib/getRisksAssuranceItems.sql.

type Params = { orgId: string | null }

export type RiskAssuranceRow = {
  risk_id: string
  project_id: string | null
  project_name: string
  item_type: string
  risk_or_assurance_item: string
  severity: string
  owner: string
  status: string
  updated_at: string | null
}

const SQL = `
with org_scope as (
  select nullif($1, '')::uuid as org_id
)
select
  r.risk_id,
  r.project_id,
  coalesce(p.project_name, 'Unknown project') as project_name,
  'Risk'::text as item_type,
  coalesce(nullif(trim(r.risk_title), ''), nullif(trim(r.risk_description), ''), 'Risk item') as risk_or_assurance_item,
  (
    case
      when r.risk_score is not null then r.risk_score::text
      when r.impact_score is not null then r.impact_score::text
      when r.likelihood_score is not null then r.likelihood_score::text
      else ''
    end
  ) as severity,
  ''::text as owner,
  coalesce(r.status, 'Open') as status,
  coalesce(r.updated_at, r.created_at) as updated_at
from risks r
cross join org_scope os
left join projects p
  on p.project_id = r.project_id
 and p.org_id = r.org_id
where r.org_id = os.org_id
  and lower(coalesce(r.status, 'open')) not in ('closed', 'resolved', 'cancelled')
order by
  r.risk_score desc nulls last,
  coalesce(r.updated_at, r.created_at) desc
limit 10;
`

export default async function getRisksAssuranceItems(
  req: { params: Params; user: User },
): Promise<RiskAssuranceRow[]> {
  const orgId = req.params.orgId ?? ''
  const result = await forgeSupabaseShadow2.query<RiskAssuranceRow>(SQL, [orgId])
  return result.data
}
