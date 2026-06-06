select user_id
from users
where lower(email) = lower({{ current_user.email }})
limit 1;