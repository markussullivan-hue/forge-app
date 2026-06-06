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
WHERE dmp.delivery_model_id = {{ (typeof preferredDeliveryModelSelect.value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(preferredDeliveryModelSelect.value)) ? preferredDeliveryModelSelect.value : "00000000-0000-0000-0000-000000000000" }}::uuid
  AND dmp.is_active = TRUE
  AND dm.is_active  = TRUE
  AND COALESCE(dmg.group_code, '') <> 'PROGRAMME_PORTFOLIO'
ORDER BY dmp.phase_order, dmp.phase_code;