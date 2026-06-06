import { runLookup } from './_runLookup'

const SQL = `
select id, service_industry_type as label, service_industry_type
from os_service_industry_type
order by id;
`

export default async function getCreateServiceIndustryType() {
  return runLookup<{ id: number; label: string; service_industry_type: string }>(SQL)
}
