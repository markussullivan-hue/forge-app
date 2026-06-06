SELECT id, email, is_active
FROM forge_users
WHERE lower(email) = lower(trim({{ emailInput.value }}))
  AND password_hash = crypt({{ passwordInput.value }}, password_hash)
  AND is_active = true;