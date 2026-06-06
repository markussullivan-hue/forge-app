import { runLookup } from './_runLookup'

const SQL = `
select id, delivery_type as label, delivery_type
from os_delivery_type
order by id;
`

export default async function getCreateDeliveryType() {
  return runLookup<{ id: number; label: string; delivery_type: string }>(SQL)
}
