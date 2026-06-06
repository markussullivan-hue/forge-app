-- Resolve the current organisation UUID for the logged-in user (via users + user_org_roles).
select uor.org_id
from users u
join user_org_roles uor on uor.user_id = u.user_id
where u.email = {{ current_user.email }}
  and coalesce(uor.is_active, true) = true
order by uor.assigned_at desc
limit 1;