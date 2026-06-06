import { runLookup } from './_runLookup'

const SQL = `
select id, scale as label, scale
from os_scale
order by id;
`

export default async function getCreateScale() {
  return runLookup<{ id: number; label: string; scale: string }>(SQL)
}
