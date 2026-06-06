const today = new Date();
const start = new Date(today.getTime() + 60 * 86400000);
const end = new Date(today.getTime() + 540 * 86400000);
const fmt = d => d.toISOString().slice(0, 10);

await initiativeName.setValue('Test · Large regulated');
await initiativeDescription.setValue(
  'Enterprise-scale regulatory remediation programme to address the ' +
  'FCA Consumer Duty obligations across the asset management business. ' +
  'Used for testing high-stakes prompt output.'
);
await initiativeBudget.setValue(8500000);
await initiativeTargetStartDate.setValue(fmt(start));
await initiativeTargetEndDate.setValue(fmt(end));

// Asset Management (id=9)
await initiativeServiceIndustrySelect.setValue([9]);

await radioGroupScale.setValue('Large');
await radioGroupComplexity.setValue('Complex');
await radioGroupReadiness.setValue('High');

await multiselectBusinessDrivers.setValue([
  'Regulatory Compliance / Change',
  'New Regulations',
  'Operational Risk Reduction',
  'Reputational Risk \nAvoidance'
]);
await multiselectImpactedFunctions.setValue([
  'Compliance', 'Operations', 'IT', 'Risk', 'Legal', 'Regulatory'
]);

await selectLifeCycleStage.setValue('Delivery');

await checkboxGroupPOTIProcesses.setValue([
  'Policies & Procedures',
  'Performance Levels',
  'Service Delivery Workflows',
  'Operational Models'
]);
await checkboxGroupPOTIOrganisation.setValue([
  'Roles & Responsibilities',
  'Organisational Structure',
  'Skills & Competency'
]);
await checkboxGroupPOTITechnology.setValue([
  'Applications',
  'Data Platforms',
  'Security Tooling',
  'Integration'
]);
await checkboxGroupPOTIInformation.setValue([
  'Regulatory Requirements',
  'Reporting Requirements',
  'KPIs',
  'Statutory Requirements'
]);

await textInputBusinessProblem.setValue(
  'FCA Consumer Duty rules require the firm to evidence good outcomes ' +
  'across products, price and value, customer understanding, and customer support. ' +
  'Current data, governance, and disclosure capabilities are insufficient ' +
  'to meet the regulatory deadline for closed products.'
);
await textInputStrategicObjectives.setValue(
  'Achieve full Consumer Duty compliance by the regulatory deadline.\n' +
  'Embed an outcomes-based product governance framework.\n' +
  'Implement a fair-value assessment process for every product.\n' +
  'Provide auditable evidence of customer-understanding metrics.'
);
await checkboxSystemTypes.setValue([
  'CRM', 'BI Dashboards', 'Big Data / Analytics', 'GRC'
]);

await explicitOutOfScopeInput.setValue(
  'Wholesale and institutional clients are out of scope under Consumer Duty. ' +
  'Sub-advised funds where the firm is not the manufacturer are excluded.'
);
await knownDependenciesInput.setValue(
  'Data Lake refresh programme; CRM migration; FCA SM&CR review cycle.'
);
await keyAssumptionsInput.setValue(
  'FCA timelines remain firm. Customer data quality sufficient for outcomes testing. ' +
  'No further regulatory clarifications materially change scope.'
);
await keyConstraintsInput.setValue(
  'Hard regulatory deadline. No tolerance for partial compliance. ' +
  'Board oversight committee meets monthly.'
);

await resourceModelSelect.setValue('system_integrator_led');
await keyRolesRequiredMultiselect.setValue([
  'sponsor_sro',
  'project_manager',
  'business_analyst',
  'governance_assurance_lead',
  'risk_control_lead',
  'data_migration_lead',
  'pmo'
]);
await stakeholderGroupsMultiselect.setValue([
  'executive_sponsor',
  'steering_committee',
  'risk_compliance',
  'business_process_owners',
  'technology_architecture',
  'data_reporting_mi',
  'pmo_governance'
]);
await budgetConfidenceSelect.setValue('finance_reviewed_range');
await budgetNotesInput.setValue(
  'Estimate prepared by external Big-4 advisory partner. +/- 15%.'
);
await qualityAssuranceExpectationsInput.setValue(
  'Three lines of defence model. Independent assurance by Internal Audit. ' +
  'External legal review of disclosures. Board sub-committee sign-off at each gate.'
);

// Programme & Portfolio / MSP
await deliveryModelGroupSelect.setValue('61472092-3bd3-46ad-9852-96fcfdea5d9b');
await preferredDeliveryModelSelect.setValue('4bad432f-a8f4-45ea-b20e-cdf452798b13');
await deliveryModelCustomInput.setValue('');

return { ok: true, preset: 'regulated' };