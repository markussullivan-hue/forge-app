-- Lists required (NOT NULL) columns in projects that do not have defaults, to ensure the Step 3 insert provides all necessary fields.
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'projects'
  and is_nullable = 'NO'
  and column_default is null
order by ordinal_position;