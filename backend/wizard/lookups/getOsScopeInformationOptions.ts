import { runLookup } from './_runLookup'

const SQL = `
select id, code as label, code as value, scope_type, help_text
from os_scope_list_information
where code is not null
order by code;
`

export default async function getOsScopeInformationOptions() {
  return runLookup<{
    id: number
    label: string
    value: string
    scope_type: string
    help_text: string | null
  }>(SQL)
}
