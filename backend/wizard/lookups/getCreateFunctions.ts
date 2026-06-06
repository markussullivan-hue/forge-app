import { runLookup } from './_runLookup'

const SQL = `
select id, "function" as label, code
from os_function
order by id;
`

export default async function getCreateFunctions() {
  return runLookup<{ id: number; label: string; code: string | null }>(SQL)
}
