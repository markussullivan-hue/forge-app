import { runLookup } from './_runLookup'

const SQL = `
select
  delivery_model_group_id as value,
  group_name as label,
  group_code,
  description,
  display_order
from delivery_model_groups
where is_active = true
order by display_order, group_name;
`

export default async function getDeliveryModelGroups() {
  return runLookup<{
    value: string
    label: string
    group_code: string | null
    description: string | null
    display_order: number | null
  }>(SQL)
}
