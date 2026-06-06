-- Lookup: process scope options for Scope - Processes multiselect
select
  id,
  code as label,
  code as value,
  scope_type,
  help_text
from os_scope_list_processes
where code is not null
order by code;