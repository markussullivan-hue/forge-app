import { runLookup } from './_runLookup'

type Params = { groupValue: string | null }

const SQL = `
select
  dm.delivery_model_id   as value,
  dm.model_name          as label,
  dm.model_code,
  dm.short_description,
  dm.allows_custom_detail,
  dm.display_order,
  dmg.group_code,
  dmg.group_name
from delivery_models dm
left join delivery_model_groups dmg
  on dmg.delivery_model_group_id = dm.delivery_model_group_id
where dm.is_active = true
  and dm.delivery_model_group_id = nullif($1, '')::uuid
order by dm.display_order, dm.model_name;
`

export default async function getDeliveryModelsForGroup(req: { params: Params }) {
  const value = req.params?.groupValue ?? ''
  return runLookup<{
    value: string
    label: string
    model_code: string | null
    short_description: string | null
    allows_custom_detail: boolean | null
    display_order: number | null
    group_code: string | null
    group_name: string | null
  }>(SQL, [value])
}
