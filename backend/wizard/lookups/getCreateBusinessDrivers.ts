import { runLookup } from './_runLookup'

const SQL = `
select id, busines_driver as label, code
from os_business_driver
order by id;
`

export default async function getCreateBusinessDrivers() {
  return runLookup<{ id: number; label: string; code: string | null }>(SQL)
}
