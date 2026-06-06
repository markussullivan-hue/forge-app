select
  option_value as value,
  option_label as label,
  helper_text
from os_options
where option_set_code = 'business_case_key_roles'
  and is_active = true
order by display_order;