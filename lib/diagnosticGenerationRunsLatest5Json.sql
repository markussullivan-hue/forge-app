-- Diagnostic: latest 5 generation_runs rows as JSON (avoid truncation)
select jsonb_pretty(
  coalesce(
    jsonb_agg(to_jsonb(x) order by x.created_at desc),
    '[]'::jsonb
  )
) as rows
from (
  select run_id, status, current_stage, stages_completed,
         org_id, entity_id, entity_type, created_at, updated_at
  from generation_runs
  order by created_at desc
  limit 5
) x;