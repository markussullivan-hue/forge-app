with actor as (
  select
    u.user_id,
    nullif({{ current_user?.email || '' }}, '') as user_email
  from users u
  where lower(u.email) = lower({{ current_user?.email || '' }})
  limit 1
)
insert into project_context (
  org_id,
  project_id,
  business_problem,
  strategic_objectives,
  systems_impacted,
  explicit_out_of_scope,
  known_dependencies,
  key_assumptions,
  key_constraints,
  resource_model,
  key_roles_required,
  stakeholder_groups,
  budget_confidence,
  budget_notes,
  quality_assurance_expectations,
  scope_poti,
  scope_processes,
  scope_organisation,
  scope_technology,
  scope_information,
  delivery_model_group_id,
  delivery_model_id,
  delivery_model_custom,
  created_by_email_snapshot,
  updated_by_email_snapshot,
  created_by_user_id,
  updated_by_user_id
)
values (
  nullif({{ createProject.data?.org_id?.[0] || createProject.data?.[0]?.org_id || '' }}, '')::uuid,
  nullif({{ createProject.data?.project_id?.[0] || createProject.data?.[0]?.project_id || '' }}, '')::uuid,

  nullif({{ textInputBusinessProblem.value || '' }}, ''),

  array(
    select trim(x)
    from regexp_split_to_table(
      coalesce({{ textInputStrategicObjectives.value || '' }}, ''),
      E'\\r?\\n'
    ) as x
    where trim(x) <> ''
  ),

  array(
    select jsonb_array_elements_text({{ JSON.stringify(checkboxSystemTypes.value || []) }}::jsonb)
  ),

  nullif({{ explicitOutOfScopeInput.value || '' }}, ''),
  nullif({{ knownDependenciesInput.value || '' }}, ''),
  nullif({{ keyAssumptionsInput.value || '' }}, ''),
  nullif({{ keyConstraintsInput.value || '' }}, ''),
  nullif({{ resourceModelSelect.value || '' }}, ''),

  array(
    select jsonb_array_elements_text({{ JSON.stringify(keyRolesRequiredMultiselect.value || []) }}::jsonb)
  ),

  array(
    select jsonb_array_elements_text({{ JSON.stringify(stakeholderGroupsMultiselect.value || []) }}::jsonb)
  ),

  nullif({{ budgetConfidenceSelect.value || '' }}, ''),
  nullif({{ budgetNotesInput.value || '' }}, ''),
  nullif({{ qualityAssuranceExpectationsInput.value || '' }}, ''),

  (
    with poti_rows as (
      select 'Processes'::text as v
      where jsonb_array_length({{ JSON.stringify(checkboxGroupPOTIProcesses.value || []) }}::jsonb) > 0
      union all
      select 'Organisation'::text
      where jsonb_array_length({{ JSON.stringify(checkboxGroupPOTIOrganisation.value || []) }}::jsonb) > 0
      union all
      select 'Technology'::text
      where jsonb_array_length({{ JSON.stringify(checkboxGroupPOTITechnology.value || []) }}::jsonb) > 0
      union all
      select 'Information'::text
      where jsonb_array_length({{ JSON.stringify(checkboxGroupPOTIInformation.value || []) }}::jsonb) > 0
    )
    select coalesce(array_agg(v), ARRAY[]::text[])
    from poti_rows
  ),

  array(
    select jsonb_array_elements_text({{ JSON.stringify(checkboxGroupPOTIProcesses.value || []) }}::jsonb)
  ),
  array(
    select jsonb_array_elements_text({{ JSON.stringify(checkboxGroupPOTIOrganisation.value || []) }}::jsonb)
  ),
  array(
    select jsonb_array_elements_text({{ JSON.stringify(checkboxGroupPOTITechnology.value || []) }}::jsonb)
  ),
  array(
    select jsonb_array_elements_text({{ JSON.stringify(checkboxGroupPOTIInformation.value || []) }}::jsonb)
  ),

  nullif({{ deliveryModelGroupSelect.value || '' }}, '')::uuid,
  nullif({{ preferredDeliveryModelSelect.value || '' }}, '')::uuid,
  nullif({{ deliveryModelCustomInput.value || '' }}, ''),

  (select user_email from actor),
  (select user_email from actor),

  (select user_id from actor),
  (select user_id from actor)
)
returning
  context_id,
  project_id,
  org_id,
  systems_impacted,
  explicit_out_of_scope,
  known_dependencies,
  key_assumptions,
  key_constraints,
  resource_model,
  key_roles_required,
  stakeholder_groups,
  budget_confidence,
  budget_notes,
  quality_assurance_expectations;