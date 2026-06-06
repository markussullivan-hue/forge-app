with actor as (
  select u.user_id
  from users u
  where lower(u.email) = lower({{ current_user?.email || '' }})
  limit 1
),

target as (
  select
    nullif({{ createdOrgIdState.value || currentOrgIdState.value || '' }}, '')::uuid     as org_id,
    nullif({{ createdProjectIdState.value || selectedProjectIdState.value || '' }}, '')::uuid as project_id
),

del as (
  delete from project_systems ps
  using target t
  where ps.project_id = t.project_id
  returning ps.project_system_id
),

incoming as (
  select
    (elem->>'categoryId')::int                  as category_id,
    nullif(elem->>'systemId', '')::int          as system_id,
    nullif(trim(elem->>'customSystemName'), '') as custom_system_name,
    elem->>'impactBucketCode'                   as impact_bucket_code,
    nullif(trim(elem->>'notes'), '')            as notes
  from jsonb_array_elements(
         {{ JSON.stringify(systemsSelectionState.value || []) }}::jsonb
       ) as elem
)

insert into project_systems (
  org_id,
  project_id,
  category_id,
  system_id,
  custom_system_name,
  impact_bucket_code,
  notes,
  created_by_user_id
)
select
  t.org_id,
  t.project_id,
  i.category_id,
  i.system_id,
  i.custom_system_name,
  i.impact_bucket_code,
  i.notes,
  a.user_id
from incoming i
cross join target t
left join actor a on true
returning project_system_id, category_id, system_id, custom_system_name, impact_bucket_code;