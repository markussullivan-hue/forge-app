import { runLookup } from './_runLookup'

const SQL = `
select
  array_agg(distinct delivery_maturity order by delivery_maturity) as delivery_maturity_values,
  array_agg(distinct regulatory_intensity order by regulatory_intensity) as regulatory_intensity_values,
  array_agg(distinct pipeline_stage order by pipeline_stage) as pipeline_stage_values,
  array_agg(distinct status order by status) as status_values
from projects;
`

export default async function getProjectsDomains() {
  return runLookup<{
    delivery_maturity_values: string[] | null
    regulatory_intensity_values: string[] | null
    pipeline_stage_values: string[] | null
    status_values: string[] | null
  }>(SQL)
}
