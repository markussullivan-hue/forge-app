import { runLookup } from './_runLookup'

const SQL = `
SELECT category_id, category_code, category_name, display_order
FROM os_system_categories
WHERE is_active = true
ORDER BY display_order, category_name;
`

export default async function getSystemCategories() {
  return runLookup<{
    category_id: string
    category_code: string | null
    category_name: string
    display_order: number | null
  }>(SQL)
}
