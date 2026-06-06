SELECT
  system_id,
  category_id,
  system_name,
  vendor,
  display_order
FROM os_systems
WHERE is_active = true
ORDER BY category_id, display_order, system_name;