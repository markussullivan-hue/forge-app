import { runLookup } from './_runLookup'

const SQL = `
SELECT code, display_label, short_description, display_order
FROM os_impact_buckets
ORDER BY display_order;
`

export default async function getImpactBuckets() {
  return runLookup<{
    code: string
    display_label: string
    short_description: string | null
    display_order: number | null
  }>(SQL)
}
