// Dashboard KPI rollups (read-only) for a given organisation.
// Mirrors /context/linked-classic-app/lib/getDashboardKpis.sql, swapping the
// `{{ currentOrgIdState.value }}` mustache for a parameterised $1::uuid.

type Params = { orgId: string | null }

type Row = {
  active_projects: string | number
  projects_requiring_decision: string | number
  artefacts_generated: string | number
  open_risks: string | number
  runs_completed: string | number
  items_needing_review: string | number
}

export type DashboardKpis = {
  active_projects: number
  projects_requiring_decision: number
  artefacts_generated: number
  open_risks: number
  runs_completed: number
  items_needing_review: number
}

const SQL = `
with org_scope as (
  select nullif($1, '')::uuid as org_id
)
select
  (
    select count(*)
    from projects p, org_scope os
    where p.org_id = os.org_id
  )::bigint as active_projects,
  (
    select count(*)
    from projects p
    cross join org_scope os
    left join delivery_model_phases dmp_lc
      on dmp_lc.phase_id = p.lifecycle_phase_id
    where p.org_id = os.org_id
      and (
        lower(coalesce(p.status, '')) in ('draft', 'initiation', 'pending approval', 'decision required')
        or dmp_lc.phase_intent = 'INITIATION'
      )
  )::bigint as projects_requiring_decision,
  (
    select count(*)
    from artefact_versions av, org_scope os
    where av.org_id = os.org_id
  )::bigint as artefacts_generated,
  (
    select count(*)
    from risks r, org_scope os
    where r.org_id = os.org_id
      and lower(coalesce(r.status, 'open')) not in ('closed', 'resolved', 'cancelled')
  )::bigint as open_risks,
  (
    select count(*)
    from generation_runs gr, org_scope os
    where gr.org_id = os.org_id
      and lower(coalesce(gr.status, '')) = 'completed'
  )::bigint as runs_completed,
  (
    select 0
  )::bigint as items_needing_review;
`

export default async function getDashboardKpis(req: { params: Params; user: User }): Promise<DashboardKpis> {
  const orgId = req.params.orgId ?? ''
  const result = await forgeSupabaseShadow2.query<Row>(SQL, [orgId])
  const row = result.data[0]
  return {
    active_projects: Number(row?.active_projects ?? 0),
    projects_requiring_decision: Number(row?.projects_requiring_decision ?? 0),
    artefacts_generated: Number(row?.artefacts_generated ?? 0),
    open_risks: Number(row?.open_risks ?? 0),
    runs_completed: Number(row?.runs_completed ?? 0),
    items_needing_review: Number(row?.items_needing_review ?? 0),
  }
}
