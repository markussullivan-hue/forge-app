const today = new Date();
const start = new Date(today.getTime() + 14 * 86400000);
const end = new Date(today.getTime() + 120 * 86400000);
const fmt = d => d.toISOString().slice(0, 10);

await initiativeName.setValue('Test · Small idea');
await initiativeDescription.setValue(
  'Early-stage exploration of a small process improvement, ' +
  'no firm scope yet. Used for testing prompt behaviour with sparse inputs.'
);
await initiativeBudget.setValue(50000);
await initiativeTargetStartDate.setValue(fmt(start));
await initiativeTargetEndDate.setValue(fmt(end));

// Retail Banking (id=1)
await initiativeServiceIndustrySelect.setValue([1]);

await radioGroupScale.setValue('Small');
await radioGroupComplexity.setValue('Simple');
await radioGroupReadiness.setValue('Low');

await multiselectBusinessDrivers.setValue([
  'Cost Reduction / Avoidance / Efficiency'
]);
await multiselectImpactedFunctions.setValue(['Operations']);

await selectLifeCycleStage.setValue('Idea');

await checkboxGroupPOTIProcesses.setValue(['Functions & Activities']);
await checkboxGroupPOTIOrganisation.setValue([]);
await checkboxGroupPOTITechnology.setValue([]);
await checkboxGroupPOTIInformation.setValue([]);

await textInputBusinessProblem.setValue(
  'Manual reconciliation of supplier invoices is slow and error-prone.'
);
await textInputStrategicObjectives.setValue('Reduce reconciliation cycle time.');
await checkboxSystemTypes.setValue(['ERP']);

// Step 3 — most blank to test null discipline
await explicitOutOfScopeInput.setValue('');
await knownDependenciesInput.setValue('');
await keyAssumptionsInput.setValue('');
await keyConstraintsInput.setValue('');
await resourceModelSelect.setValue(null);
await keyRolesRequiredMultiselect.setValue([]);
await stakeholderGroupsMultiselect.setValue([]);
await budgetConfidenceSelect.setValue(null);
await budgetNotesInput.setValue('');
await qualityAssuranceExpectationsInput.setValue('');

// Project Controls / PRINCE2
await deliveryModelGroupSelect.setValue('4b8b3c0f-0286-4236-a956-7c41b3c5b306');
await preferredDeliveryModelSelect.setValue('a2968107-0737-4e34-a2d4-11731ed16fff');
await deliveryModelCustomInput.setValue('');

return { ok: true, preset: 'minimal' };