import { runLookup } from './_runLookup'

// Originally inlined the chosen delivery_model_id via a mustache. We accept
// it as an optional param and fall back to a zero UUID (which returns no
// rows) so the call shape mirrors the classic behaviour.
type Params = { deliveryModelId?: string | null }

const ZERO_UUID = '00000000-0000-0000-0000-000000000000'

const SQL = `
SELECT
    dmp.phase_id            AS id,
    dmp.phase_name          AS label,
    dmp.phase_code          AS code,
    dmp.phase_order         AS sort_order,
    dmp.purpose             AS description,
    dmp.decision_gate       AS decision_gate,
    dmp.gate_type           AS gate_type,
    dmp.is_optional         AS is_optional
FROM delivery_model_phases dmp
JOIN delivery_models dm
  ON dm.delivery_model_id = dmp.delivery_model_id
LEFT JOIN delivery_model_groups dmg
  ON dmg.delivery_model_group_id = dm.delivery_model_group_id
WHERE dmp.delivery_model_id = $1::uuid
  AND dmp.is_active = TRUE
  AND dm.is_active = TRUE
  AND COALESCE(dmg.group_code, '') <> 'PROGRAMME_PORTFOLIO'
ORDER BY dmp.phase_order, dmp.phase_code;
`

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function getCreateLifecycleStage(req: { params: Params }) {
  const raw = req.params?.deliveryModelId ?? ''
  const id = typeof raw === 'string' && UUID_RE.test(raw) ? raw : ZERO_UUID
  return runLookup(SQL, [id])
}
