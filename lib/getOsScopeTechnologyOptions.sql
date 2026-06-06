-- Lookup: technology scope options for Scope - Technology multiselect
select
  id,
  code as label,
  code as value,
  scope_type,
  help_text
from os_scope_list_technology
where code is not null
order by code;