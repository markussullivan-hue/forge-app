import { runLookup } from './_runLookup'

const SQL = `
select id, complexity_level as label, complexity_level
from os_complexity_levels
order by id;
`

export default async function getCreatComplexityLevels() {
  return runLookup<{ id: number; label: string; complexity_level: string }>(SQL)
}
