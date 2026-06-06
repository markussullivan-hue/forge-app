select
  delivery_model_group_id as value,
  group_name as label,
  group_code,
  description,
  display_order
from delivery_model_groups
where is_active = true
order by display_order, group_name;