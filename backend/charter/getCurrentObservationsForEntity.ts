// Charter page: current observations artefact for a Project entity (read-only).
// Mirrors /context/linked-classic-app/lib/getCurrentObservationsForEntity.sql.

type Params = {
  orgId: string | null
  entityType: 'Project'
  entityId: string | null
}

export type ObservationRow = {
  project_id: string
  current_observations_version_id: string | null
  version_id: string | null
  version_number: number | null
  is_current: boolean | null
  content_metadata: unknown
  additional_metadata_json: unknown
  generated_at: string | null
  generated_by_email_snapshot: string | null
}

const SQL = `
select
  p.project_id,
  p.current_observations_version_id,
  av.version_id,
  av.version_number,
  av.is_current,
  av.content_metadata,
  av.additional_metadata_json,
  av.generated_at,
  av.generated_by_email_snapshot
from projects p
left join artefact_versions av
       on av.version_id = p.current_observations_version_id
      and av.org_id    = p.org_id
where p.org_id     = nullif($1, '')::uuid
  and p.project_id = nullif($2, '')::uuid
limit 1;
`

export default async function getCurrentObservationsForEntity(
  req: { params: Params; user: User },
): Promise<ObservationRow[]> {
  // entityType is part of the contract but the underlying query is project-scoped only.
  void req.params.entityType
  const orgId = req.params.orgId ?? ''
  const entityId = req.params.entityId ?? ''
  const result = await forgeSupabaseShadow2.query<ObservationRow>(SQL, [orgId, entityId])
  return result.data
}
