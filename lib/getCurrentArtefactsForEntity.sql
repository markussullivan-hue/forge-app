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
where av.org_id = nullif({{ currentOrgIdState.value }}, '')::uuid
  and av.entity_type = 'Project'
  and av.entity_id = nullif({{ selectedProjectIdState.value }}, '')::uuid
  and av.is_current = true
order by dma.sort_order asc, av.generated_at desc, av.version_number desc;