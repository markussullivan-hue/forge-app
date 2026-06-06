select
  review_id,
  status,
  material_type,
  material_type_label,
  ai_relevance,
  ai_relevance_label,
  methodology_lens,
  methodology_lens_label,
  character_count,
  word_count,
  result_json,
  diagnostics_json,
  error_message,
  created_at,
  completed_at,
  expires_at
from governance_review_runs
where review_id = {{ reviewId }}::uuid
limit 1;