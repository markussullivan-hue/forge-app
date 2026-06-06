import { runLookup } from './_runLookup'

const SQL = `
SELECT id, scope, help_text
FROM os_scope
ORDER BY scope;
`

export default async function getCreateScopes() {
  return runLookup<{ id: number; scope: string; help_text: string | null }>(SQL)
}
