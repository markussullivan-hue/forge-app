import { runLookup } from './_runLookup'

const SQL = `
select
  delivery_model_id as value,
  model_name as label,
  model_code,
  model_category,
  description
from delivery_models
where is_active = true
order by display_order, model_name;
`

export default async function deliveryModelSelect() {
  return runLookup<{
    value: string
    label: string
    model_code: string | null
    model_category: string | null
    description: string | null
  }>(SQL)
}
