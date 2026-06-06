-- Diagnostic: latest 5 generation_runs rows
select run_id, status, current_stage, stages_completed, 
       org_id, entity_id, entity_type, created_at, updated_at
from generation_runs
order by created_at desc
limit 5;