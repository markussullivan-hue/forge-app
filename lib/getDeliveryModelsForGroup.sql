select
  dm.delivery_model_id   as value,
  dm.model_name          as label,
  dm.model_code,
  dm.short_description,
  dm.allows_custom_detail,
  dm.display_order,
  dmg.group_code,
  dmg.group_name
from delivery_models dm
left join delivery_model_groups dmg
  on dmg.delivery_model_group_id = dm.delivery_model_group_id
where dm.is_active = true
  and dm.delivery_model_group_id = nullif({{ deliveryModelGroupSelect.value }}, '')::uuid
order by dm.display_order, dm.model_name;