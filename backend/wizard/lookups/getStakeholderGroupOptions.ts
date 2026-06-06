import { runLookup } from './_runLookup'

const SQL = `
select option_value as value, option_label as label, helper_text
from os_options
where option_set_code = 'business_case_stakeholder_groups'
  and is_active = true
order by display_order;
`

export default async function getStakeholderGroupOptions() {
  return runLookup<{ value: string; label: string; helper_text: string | null }>(SQL)
}
