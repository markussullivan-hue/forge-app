-- Fetch generation run records for the current org, ordered by created_at DESC. (Added stages_completed and updated_at for run status detail views.)
-- Fetch generation run records for the current org, ordered by created_at DESC (manual trigger only).
-- Fetch generation run records for the current org, ordered by created_at DESC
select
  run_id,
  org_id,
  entity_type,
  entity_id,
  correlation_id,
  workflow_run_id,
  status,
  current_stage,
  stages_completed,
  is_regeneration,
  error_message,
  total_duration_ms,
  initiated_by_email,
  started_at,
  completed_at,
  updated_at,
  created_at
from generation_runs
where
  ({{ !currentOrgIdState.value }} or org_id = {{ currentOrgIdState.value }}::uuid)
order by created_at desc;