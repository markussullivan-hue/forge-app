select
  delivery_model_id as value,
  model_name as label,
  model_code,
  model_category,
  description
from delivery_models
where is_active = true
order by display_order, model_name;