import { runLookup } from './_runLookup'

const SQL = `
select id, system_type as label, system_type as value, code
from os_it_systems_types
where system_type is not null
order by system_type;
`

export default async function getOsItSystemTypesOptions() {
  return runLookup<{ id: number; label: string; value: string; code: string | null }>(SQL)
}
