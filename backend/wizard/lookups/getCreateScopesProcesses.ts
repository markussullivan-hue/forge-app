import { runLookup } from './_runLookup'

const SQL = `
SELECT id, scope_type, code
FROM os_scope_list_processes
ORDER BY scope_type;
`

export default async function getCreateScopesProcesses() {
  return runLookup<{ id: number; scope_type: string; code: string | null }>(SQL)
}
