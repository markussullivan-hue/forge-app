-- Lookup: information scope options for Scope - Information multiselect
select
  id,
  code as label,
  code as value,
  scope_type,
  help_text
from os_scope_list_information
where code is not null
order by code;