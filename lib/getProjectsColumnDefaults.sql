-- Inspect defaults/nullability for columns in projects to determine which fields must be provided by the Step 3 create flow.
select
  column_name,
  is_nullable,
  column_default,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'projects'
order by ordinal_position;