import { runLookup } from './_runLookup'

const SQL = `
select id, org_familiarity as label, org_familiarity
from os_org_familiarity
order by id;
`

export default async function getCreateOrgFamiliarity() {
  return runLookup<{ id: number; label: string; org_familiarity: string }>(SQL)
}
