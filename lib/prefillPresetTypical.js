const today = new Date();
const start = new Date(today.getTime() + 30 * 86400000);
const end = new Date(today.getTime() + 270 * 86400000);
const fmt = d => d.toISOString().slice(0, 10);

await initiativeName.setValue('Test · Medium plan');
await initiativeDescription.setValue(
  'Mid-sized initiative to consolidate three customer service systems ' +
  'into a single platform. Realistic baseline test data.'
);
await initiativeBudget.setValue(750000);
await initiativeTargetStartDate.setValue(fmt(start));
await initiativeTargetEndDate.setValue(fmt(end));

// Commercial Banking (id=2)
await initiativeServiceIndustrySelect.setValue([2]);

await radioGroupScale.setValue('Medium');
await radioGroupComplexity.setValue('Moderate');
await radioGroupReadiness.setValue('Medium');

await multiselectBusinessDrivers.setValue([
  'Customer NPS',
  'Cost Reduction / Avoidance / Efficiency',
  'Operational Risk Reduction'
]);
await multiselectImpactedFunctions.setValue([
  'IT', 'Customer', 'Operations'
]);

await selectLifeCycleStage.setValue('Mobilisation');

await checkboxGroupPOTIProcesses.setValue([
  'Functions & Activities',
  'Service Delivery Workflows'
]);
await checkboxGroupPOTIOrganisation.setValue([
  'Roles & Responsibilities'
]);
await checkboxGroupPOTITechnology.setValue([
  'Applications',
  'Integration'
]);
await checkboxGroupPOTIInformation.setValue([
  'Operational Data'
]);

await textInputBusinessProblem.setValue(
  'Three legacy customer service systems create handoff friction, ' +
  'inconsistent customer data, and rising operating cost. Average handle ' +
  'time has grown 18% over 18 months.'
);
await textInputStrategicObjectives.setValue(
  'Unify customer service onto a single platform.\n' +
  'Reduce average handle time by 20%.\n' +
  'Standardise customer data across channels.'
);
await checkboxSystemTypes.setValue(['CRM', 'WF Automation']);

await explicitOutOfScopeInput.setValue(
  'Field service operations and back-office finance systems are not in scope.'
);
await knownDependenciesInput.setValue(
  'Concurrent identity-management programme due to deliver SSO in Q3.'
);
await keyAssumptionsInput.setValue(
  'Existing call recordings can be migrated. Vendor will provide migration tooling.'
);
await keyConstraintsInput.setValue(
  'Must avoid customer-facing changes during peak November-December trading.'
);

await resourceModelSelect.setValue('hybrid_internal_vendor');
await keyRolesRequiredMultiselect.setValue([
  'sponsor_sro',
  'project_manager',
  'business_analyst',
  'technical_lead_architect',
  'test_lead'
]);
await stakeholderGroupsMultiselect.setValue([
  'executive_sponsor',
  'steering_committee',
  'business_process_owners',
  'technology_architecture',
  'end_users_super_users'
]);
await budgetConfidenceSelect.setValue('indicative_range');
await budgetNotesInput.setValue(
  'Estimate based on vendor indicative pricing; +/- 25%.'
);
await qualityAssuranceExpectationsInput.setValue(
  'Peer review of artefacts, two rounds of UAT, ' +
  'penetration test before go-live.'
);

// Project Controls / PRINCE2
await deliveryModelGroupSelect.setValue('4b8b3c0f-0286-4236-a956-7c41b3c5b306');
await preferredDeliveryModelSelect.setValue('a2968107-0737-4e34-a2d4-11731ed16fff');
await deliveryModelCustomInput.setValue('');

return { ok: true, preset: 'typical' };