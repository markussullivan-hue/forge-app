-- Lookup: organisation scope options for Scope - Organisation multiselect
select
  id,
  code as label,
  code as value,
  scope_type,
  help_text
from os_scope_list_organisation
where code is not null
order by code;