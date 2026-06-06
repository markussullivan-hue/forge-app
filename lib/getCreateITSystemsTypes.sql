-- Lookup: IT system types options for IT System Types multiselect
select
  id,
  system_type as label,
  system_type as value,
  code
from os_it_systems_types
where system_type is not null
order by system_type;