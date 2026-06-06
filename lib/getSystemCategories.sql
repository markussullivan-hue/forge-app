SELECT
  category_id,
  category_code,
  category_name,
  display_order
FROM os_system_categories
WHERE is_active = true
ORDER BY display_order, category_name;