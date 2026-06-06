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
where p.org_id     = nullif({{ currentOrgIdState.value }}, '')::uuid
  and p.project_id = nullif({{ selectedProjectIdState.value }}, '')::uuid
limit 1;