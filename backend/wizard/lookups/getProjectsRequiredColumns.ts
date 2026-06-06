import { runLookup } from './_runLookup'

const SQL = `
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'projects'
  and is_nullable = 'NO'
  and column_default is null
order by ordinal_position;
`

export default async function getProjectsRequiredColumns() {
  return runLookup<{
    column_name: string
    data_type: string
    is_nullable: string
    column_default: string | null
  }>(SQL)
}
