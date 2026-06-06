import { runLookup } from './_runLookup'

// Classic getSystems.sql ignores the category filter — it returns every active
// row. We accept an optional categoryId so the frontend can adopt a narrower
// fetch later; passing null/empty preserves the existing behaviour.
type Params = { categoryId?: string | null }

export default async function getSystems(req: { params?: Params }) {
  const categoryId = req?.params?.categoryId ?? null

  if (categoryId) {
    const SQL_FILTERED = `
      SELECT system_id, category_id, system_name, vendor, display_order
      FROM os_systems
      WHERE is_active = true AND category_id = $1::uuid
      ORDER BY category_id, display_order, system_name;
    `
    return runLookup<{
      system_id: string
      category_id: string
      system_name: string
      vendor: string | null
      display_order: number | null
    }>(SQL_FILTERED, [categoryId])
  }

  const SQL_ALL = `
    SELECT system_id, category_id, system_name, vendor, display_order
    FROM os_systems
    WHERE is_active = true
    ORDER BY category_id, display_order, system_name;
  `
  return runLookup<{
    system_id: string
    category_id: string
    system_name: string
    vendor: string | null
    display_order: number | null
  }>(SQL_ALL)
}
