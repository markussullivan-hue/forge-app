const isBlank = (v) =>
v === null ||
v === undefined ||
v === '' ||
typeof v === 'string' && v.trim() === '' ||
Array.isArray(v) && v.length === 0;

const cleanObj = (obj) =>
Object.fromEntries(
Object.entries(obj).filter(([, value]) => !isBlank(value)));


const fmtDate = (v) => {
  if (isBlank(v)) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('en-GB');
};

const fmtArray = (v) => {
  if (isBlank(v)) return null;
  return Array.isArray(v) ? v.join(', ') : String(v);
};

const fmtMoney = (v) => {
  if (isBlank(v)) return null;
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0 }).
  format(n);
};

const fmtSelectLabel = (component) => {
  if (!component || isBlank(component.value)) return null;

  return (
    component.selectedLabel ||
    component.selectedItem?.label ||
    component.selectedItem?.name ||
    component.displayValue ||
    component.value);

};

const fmtMultiSelectLabels = (component) => {
  if (!component || isBlank(component.value)) return null;

  if (Array.isArray(component.selectedLabels) && component.selectedLabels.length > 0) {
    return component.selectedLabels.join(', ');
  }

  if (Array.isArray(component.selectedItems) && component.selectedItems.length > 0) {
    return component.selectedItems.
    map((item) => item.label || item.name || item.value || item.id).
    filter(Boolean).
    join(', ');
  }

  return fmtArray(component.value);
};

return {
  isReadyToGenerate: [
  !isBlank(initiativeName.value),
  !isBlank(initiativeDescription.value),
  !isBlank(initiativeBudget.value),
  !isBlank(initiativeTargetStartDate.value),
  !isBlank(initiativeTargetEndDate.value),
  !isBlank(initiativeServiceIndustrySelect.value),
  !isBlank(radioGroupScale.value),
  !isBlank(radioGroupComplexity.value),
  !isBlank(radioGroupReadiness.value),
  !isBlank(multiselectBusinessDrivers.value),
  !isBlank(multiselectImpactedFunctions.value),
  !isBlank(selectLifeCycleStage.value),
  !isBlank(checkboxGroupPOTIProcesses.value),
  !isBlank(checkboxGroupPOTIOrganisation.value),
  !isBlank(checkboxGroupPOTITechnology.value),
  !isBlank(checkboxGroupPOTIInformation.value),
  !isBlank(textInputBusinessProblem.value),
  !isBlank(checkboxSystemTypes.value)].
  every(Boolean),

  highlights: cleanObj({
    'Initiative': initiativeName.value,
    'Estimated budget': fmtMoney(initiativeBudget.value),
    'Lifecycle stage': fmtSelectLabel(selectLifeCycleStage),
    'Complexity': radioGroupComplexity.value,
    'Business drivers': fmtMultiSelectLabels(multiselectBusinessDrivers),
    'Processes in scope': fmtMultiSelectLabels(checkboxGroupPOTIProcesses),
    'Organisation in scope': fmtMultiSelectLabels(checkboxGroupPOTIOrganisation),
    'Technology in scope': fmtMultiSelectLabels(checkboxGroupPOTITechnology),
    'Information in scope': fmtMultiSelectLabels(checkboxGroupPOTIInformation),
    'System types impacted': fmtMultiSelectLabels(checkboxSystemTypes) }),


  overview: cleanObj({
    'Initiative name': initiativeName.value,
    'Description': initiativeDescription.value,
    'Estimated budget': fmtMoney(initiativeBudget.value),
    'Target start date': fmtDate(initiativeTargetStartDate.value),
    'Target end date': fmtDate(initiativeTargetEndDate.value),
    'Service industry': fmtMultiSelectLabels(initiativeServiceIndustrySelect) }),


  dimensions: cleanObj({
    'Scale': radioGroupScale.value,
    'Complexity': radioGroupComplexity.value,
    'Organisational readiness': radioGroupReadiness.value,
    'Lifecycle stage': fmtSelectLabel(selectLifeCycleStage),
    'Business drivers': fmtMultiSelectLabels(multiselectBusinessDrivers),
    'Impacted functions': fmtMultiSelectLabels(multiselectImpactedFunctions),
    'Processes in scope': fmtMultiSelectLabels(checkboxGroupPOTIProcesses),
    'Organisation in scope': fmtMultiSelectLabels(checkboxGroupPOTIOrganisation),
    'Technology in scope': fmtMultiSelectLabels(checkboxGroupPOTITechnology),
    'Information in scope': fmtMultiSelectLabels(checkboxGroupPOTIInformation) }),


  contextSystems: cleanObj({
    'Business problem': textInputBusinessProblem.value,
    'Strategic objectives': textInputStrategicObjectives.value,
    'System types impacted': fmtMultiSelectLabels(checkboxSystemTypes) }),


  businessCaseDetail: cleanObj({
    'Explicit out of scope': explicitOutOfScopeInput.value,
    'Known dependencies': knownDependenciesInput.value,
    'Key assumptions': keyAssumptionsInput.value,
    'Key constraints': keyConstraintsInput.value,
    'Resource model': fmtSelectLabel(resourceModelSelect),
    'Key roles required': fmtMultiSelectLabels(keyRolesRequiredMultiselect),
    'Stakeholder groups': fmtMultiSelectLabels(stakeholderGroupsMultiselect),
    'Budget confidence': fmtSelectLabel(budgetConfidenceSelect),
    'Budget notes': budgetNotesInput.value,
    'Quality / assurance expectations': qualityAssuranceExpectationsInput.value }) };