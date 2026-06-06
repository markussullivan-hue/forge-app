select
  project_id,
  nullif(trim(project_name), '') as project_name,
  project_code
from projects
where org_id = nullif({{ currentOrgIdState.value }}, '')::uuid
order by coalesce(nullif(trim(project_name), ''), project_code);