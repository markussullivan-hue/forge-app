import { runLookup } from './_runLookup'

const SQL = `
select column_name, is_nullable, column_default, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'projects'
order by ordinal_position;
`

export default async function getProjectsColumnDefaults() {
  return runLookup<{
    column_name: string
    is_nullable: string
    column_default: string | null
    data_type: string
  }>(SQL)
}
