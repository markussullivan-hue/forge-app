// Charter page: current artefacts for a Project entity (read-only).
// Mirrors /context/linked-classic-app/lib/getCurrentArtefactsForEntity.sql.

type Params = {
  orgId: string | null
  entityType: 'Project'
  entityId: string | null
}

export type ArtefactRow = {
  version_id: string
  version_number: number | null
  is_current: boolean
  entity_type: string
  entity_id: string
  artefact_type_id: string | null
  delivery_model_artefact_id: string
  content_markdown: string | null
  content_metadata: unknown
  additional_metadata_json: unknown
  generated_at: string | null
  generated_by_email_snapshot: string | null
  artefact_code: string
  artefact_name: string
  sort_order: number
  canonical_artefact_type: string | null
  rendering_pattern: string | null
  model_code: string | null
  model_name: string | null
}

const SQL = `
select
  av.version_id,
  av.version_number,
  av.is_current,
  av.entity_type,
  av.entity_id,
  av.artefact_type_id,
  av.delivery_model_artefact_id,
  av.content_markdown,
  av.content_metadata,
  av.additional_metadata_json,
  av.generated_at,
  av.generated_by_email_snapshot,
  dma.artefact_code,
  dma.artefact_name,
  dma.sort_order,
  dma.canonical_artefact_type,
  dma.rendering_pattern,
  dm.model_code,
  dm.model_name
from artefact_versions av
join delivery_model_artefacts dma
  on dma.delivery_model_artefact_id = av.delivery_model_artefact_id
join delivery_models dm
  on dm.delivery_model_id = dma.delivery_model_id
where av.org_id = nullif($1, '')::uuid
  and av.entity_type = $2
  and av.entity_id = nullif($3, '')::uuid
  and av.is_current = true
order by dma.sort_order asc, av.generated_at desc, av.version_number desc;
`

export default async function getCurrentArtefactsForEntity(
  req: { params: Params; user: User },
): Promise<ArtefactRow[]> {
  const orgId = req.params.orgId ?? ''
  const entityType = req.params.entityType ?? 'Project'
  const entityId = req.params.entityId ?? ''
  const result = await forgeSupabaseShadow2.query<ArtefactRow>(SQL, [orgId, entityType, entityId])
  return result.data
}
