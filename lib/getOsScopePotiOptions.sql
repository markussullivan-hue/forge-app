-- Lookup: POTI parent scope values for Scope (POTI) multiselect
select
  id,
  scope as label,
  scope as value,
  help_text
from os_scope
where scope is not null
order by scope;