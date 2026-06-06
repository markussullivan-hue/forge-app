-- Create a new project row + primary delivery model link for the intake wizard.
-- Atomic: both rows are inserted in a single statement; if any guard fails,
-- nothing is written.
with current_org as (
  select uor.org_id
  from users u
  join user_org_roles uor
    on uor.user_id = u.user_id
  where lower(u.email) = lower({{ current_user?.email || '' }})
  limit 1
),
current_app_user as (
  select u.user_id
  from users u
  where lower(u.email) = lower({{ current_user?.email || '' }})
  limit 1
),
inputs as (
  select
    nullif({{
      (
        (initiativeServiceIndustrySelect.selectedItems || [])
          .map(item =>
            item?.label ??
            item?.service_industry ??
            item?.name ??
            item?.industry ??
            item?.value ??
            item?.id
          )
          .filter(Boolean)
          .join(', ')
      ) ||
      (
        Array.isArray(initiativeServiceIndustrySelect.value)
          ? initiativeServiceIndustrySelect.value.filter(Boolean).join(', ')
          : (initiativeServiceIndustrySelect.value || '')
      )
    }}, '')                                                       as service_industry_text,
    nullif({{ radioGroupReadiness.value || '' }}, '')             as readiness,
    nullif({{ selectLifeCycleStage.value || '' }}, '')::uuid      as lifecycle_phase_id,
    nullif({{ preferredDeliveryModelSelect.value || '' }}, '')::uuid
                                                                  as delivery_model_id
),
guards as (
  select
    -- Hard preconditions. If any of these is null the wizard let through
    -- a forbidden state; we refuse to write rather than silently corrupt.
    case when (select org_id from current_org) is null
      then 1 / 0 end                                              as guard_org,
    case when i.lifecycle_phase_id is null
      then 1 / 0 end                                              as guard_phase,
    case when i.delivery_model_id is null
      then 1 / 0 end                                              as guard_model
  from inputs i
),
new_project as (
  insert into projects (
    org_id,
    project_code,
    project_name,
    description,
    service_industry,
    start_date,
    target_end_date,
    pipeline_stage,
    lifecycle_phase_id,
    status,
    delivery_maturity,
    regulatory_intensity,
    estimated_budget_gbp,
    business_drivers,
    impacted_functions,
    organisational_readiness,
    scale,
    complexity,
    entity_type,
    created_by_user_id,
    created_by_email_snapshot
  )
  select
    co.org_id,
    {{ ('PRJ-' + uuid.v4().slice(0, 8)).toUpperCase() }},
    {{ initiativeName.value }},
    {{ initiativeDescription.value }},
    i.service_industry_text,
    nullif({{ initiativeTargetStartDate.value }}, '')::date,
    nullif({{ initiativeTargetEndDate.value }}, '')::date,
    'Not Started',
    i.lifecycle_phase_id,
    'Initiation',
    case
      when i.readiness = 'High'   then 'High'
      when i.readiness = 'Low'    then 'Low'
      else 'Moderate'
    end,
    case
      when i.service_industry_text ~* '(financial|banking|insurance|health|pharma|public sector|government|defen[cs]e|aviation|nuclear|energ|utilit|telecom)'
        then 'High'
      when i.service_industry_text ~* '(retail|marketing|consult|hospitality|media|entertain)'
        then 'Low'
      else 'Medium'
    end,
    nullif({{ initiativeBudget.value || '' }}, '')::numeric,
    array(
      select jsonb_array_elements_text({{ JSON.stringify(multiselectBusinessDrivers.value || []) }}::jsonb)
    ),
    array(
      select jsonb_array_elements_text({{ JSON.stringify(multiselectImpactedFunctions.value || []) }}::jsonb)
    ),
    i.readiness,
    nullif({{ radioGroupScale.value || '' }}, ''),
    nullif({{ radioGroupComplexity.value || '' }}, ''),
    'Project',
    cu.user_id,
    nullif({{ current_user?.email || '' }}, '')
  from current_org co
  cross join inputs i
  cross join guards g
  left join current_app_user cu on true
  returning
    project_id,
    org_id,
    service_industry,
    organisational_readiness,
    delivery_maturity,
    regulatory_intensity
),
new_pdm as (
  insert into project_delivery_models (
    org_id,
    project_id,
    delivery_model_id,
    role,
    display_order
  )
  select
    np.org_id,
    np.project_id,
    i.delivery_model_id,
    'Primary',
    10
  from new_project np
  cross join inputs i
  returning project_delivery_model_id
)
select
  np.project_id,
  np.org_id,
  np.service_industry,
  np.organisational_readiness,
  np.delivery_maturity,
  np.regulatory_intensity,
  pdm.project_delivery_model_id
from new_project np
cross join new_pdm pdm;