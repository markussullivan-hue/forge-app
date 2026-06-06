import { runLookup } from './_runLookup'

const SQL = `
select id, scope as label, scope as value, help_text
from os_scope
where scope is not null
order by scope;
`

export default async function getOsScopePotiOptions() {
  return runLookup<{ id: number; label: string; value: string; help_text: string | null }>(SQL)
}
