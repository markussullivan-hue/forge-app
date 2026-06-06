import { runLookup } from './_runLookup'

const SQL = `
select id, confidence as label, confidence
from os_confidence
order by id;
`

export default async function getCreateConfidenceLevel() {
  return runLookup<{ id: number; label: string; confidence: string }>(SQL)
}
