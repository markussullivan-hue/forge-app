// Wizard prefill presets, ported from the classic prefillPreset{Minimal,Typical,Regulated}.js
// queries. Each preset returns a partial wizard-state patch.

import type { WizardState } from './wizardState'

const fmt = (d: Date): string => d.toISOString().slice(0, 10)

export type PresetKey = 'minimal' | 'typical' | 'regulated'

export function getPreset(key: PresetKey): Partial<WizardState> {
  const today = new Date()

  if (key === 'minimal') {
    const start = new Date(today.getTime() + 14 * 86400000)
    const end = new Date(today.getTime() + 120 * 86400000)
    return {
      initiativeName: 'Test · Small idea',
      initiativeDescription:
        'Early-stage exploration of a small process improvement, no firm scope yet. Used for testing prompt behaviour with sparse inputs.',
      initiativeBudget: 50000,
      initiativeTargetStartDate: fmt(start),
      initiativeTargetEndDate: fmt(end),
      initiativeServiceIndustrySelect: [1],
      radioGroupScale: 'Small',
      radioGroupComplexity: 'Simple',
      radioGroupReadiness: 'Low',
      multiselectBusinessDrivers: ['Cost Reduction / Avoidance / Efficiency'],
      multiselectImpactedFunctions: ['Operations'],
      selectLifeCycleStage: 'Idea',
      checkboxGroupPOTIProcesses: ['Functions & Activities'],
      checkboxGroupPOTIOrganisation: [],
      checkboxGroupPOTITechnology: [],
      checkboxGroupPOTIInformation: [],
      textInputBusinessProblem:
        'Manual reconciliation of supplier invoices is slow and error-prone.',
      textInputStrategicObjectives: 'Reduce reconciliation cycle time.',

      explicitOutOfScopeInput: '',
      knownDependenciesInput: '',
      keyAssumptionsInput: '',
      keyConstraintsInput: '',
      resourceModelSelect: null,
      keyRolesRequiredMultiselect: [],
      stakeholderGroupsMultiselect: [],
      budgetConfidenceSelect: null,
      budgetNotesInput: '',
      qualityAssuranceExpectationsInput: '',

      deliveryModelGroupSelect: '4b8b3c0f-0286-4236-a956-7c41b3c5b306',
      preferredDeliveryModelSelect: 'a2968107-0737-4e34-a2d4-11731ed16fff',
      deliveryModelCustomInput: '',
    }
  }

  if (key === 'typical') {
    const start = new Date(today.getTime() + 30 * 86400000)
    const end = new Date(today.getTime() + 270 * 86400000)
    return {
      initiativeName: 'Test · Medium plan',
      initiativeDescription:
        'Mid-sized initiative to consolidate three customer service systems into a single platform. Realistic baseline test data.',
      initiativeBudget: 750000,
      initiativeTargetStartDate: fmt(start),
      initiativeTargetEndDate: fmt(end),
      initiativeServiceIndustrySelect: [2],
      radioGroupScale: 'Medium',
      radioGroupComplexity: 'Moderate',
      radioGroupReadiness: 'Medium',
      multiselectBusinessDrivers: [
        'Customer NPS',
        'Cost Reduction / Avoidance / Efficiency',
        'Operational Risk Reduction',
      ],
      multiselectImpactedFunctions: ['IT', 'Customer', 'Operations'],
      selectLifeCycleStage: 'Mobilisation',
      checkboxGroupPOTIProcesses: ['Functions & Activities', 'Service Delivery Workflows'],
      checkboxGroupPOTIOrganisation: ['Roles & Responsibilities'],
      checkboxGroupPOTITechnology: ['Applications', 'Integration'],
      checkboxGroupPOTIInformation: ['Operational Data'],
      textInputBusinessProblem:
        'Three legacy customer service systems create handoff friction, inconsistent customer data, and rising operating cost. Average handle time has grown 18% over 18 months.',
      textInputStrategicObjectives:
        'Unify customer service onto a single platform.\nReduce average handle time by 20%.\nStandardise customer data across channels.',

      explicitOutOfScopeInput:
        'Field service operations and back-office finance systems are not in scope.',
      knownDependenciesInput:
        'Concurrent identity-management programme due to deliver SSO in Q3.',
      keyAssumptionsInput:
        'Existing call recordings can be migrated. Vendor will provide migration tooling.',
      keyConstraintsInput:
        'Must avoid customer-facing changes during peak November-December trading.',

      resourceModelSelect: 'hybrid_internal_vendor',
      keyRolesRequiredMultiselect: [
        'sponsor_sro',
        'project_manager',
        'business_analyst',
        'technical_lead_architect',
        'test_lead',
      ],
      stakeholderGroupsMultiselect: [
        'executive_sponsor',
        'steering_committee',
        'business_process_owners',
        'technology_architecture',
        'end_users_super_users',
      ],
      budgetConfidenceSelect: 'indicative_range',
      budgetNotesInput: 'Estimate based on vendor indicative pricing; +/- 25%.',
      qualityAssuranceExpectationsInput:
        'Peer review of artefacts, two rounds of UAT, penetration test before go-live.',

      deliveryModelGroupSelect: '4b8b3c0f-0286-4236-a956-7c41b3c5b306',
      preferredDeliveryModelSelect: 'a2968107-0737-4e34-a2d4-11731ed16fff',
      deliveryModelCustomInput: '',
    }
  }

  // regulated
  const start = new Date(today.getTime() + 60 * 86400000)
  const end = new Date(today.getTime() + 540 * 86400000)
  return {
    initiativeName: 'Test · Large regulated',
    initiativeDescription:
      'Enterprise-scale regulatory remediation programme to address the FCA Consumer Duty obligations across the asset management business. Used for testing high-stakes prompt output.',
    initiativeBudget: 8500000,
    initiativeTargetStartDate: fmt(start),
    initiativeTargetEndDate: fmt(end),
    initiativeServiceIndustrySelect: [9],
    radioGroupScale: 'Large',
    radioGroupComplexity: 'Complex',
    radioGroupReadiness: 'High',
    multiselectBusinessDrivers: [
      'Regulatory Compliance / Change',
      'New Regulations',
      'Operational Risk Reduction',
      'Reputational Risk \nAvoidance',
    ],
    multiselectImpactedFunctions: ['Compliance', 'Operations', 'IT', 'Risk', 'Legal', 'Regulatory'],
    selectLifeCycleStage: 'Delivery',
    checkboxGroupPOTIProcesses: [
      'Policies & Procedures',
      'Performance Levels',
      'Service Delivery Workflows',
      'Operational Models',
    ],
    checkboxGroupPOTIOrganisation: [
      'Roles & Responsibilities',
      'Organisational Structure',
      'Skills & Competency',
    ],
    checkboxGroupPOTITechnology: ['Applications', 'Data Platforms', 'Security Tooling', 'Integration'],
    checkboxGroupPOTIInformation: [
      'Regulatory Requirements',
      'Reporting Requirements',
      'KPIs',
      'Statutory Requirements',
    ],
    textInputBusinessProblem:
      'FCA Consumer Duty rules require the firm to evidence good outcomes across products, price and value, customer understanding, and customer support. Current data, governance, and disclosure capabilities are insufficient to meet the regulatory deadline for closed products.',
    textInputStrategicObjectives:
      'Achieve full Consumer Duty compliance by the regulatory deadline.\nEmbed an outcomes-based product governance framework.\nImplement a fair-value assessment process for every product.\nProvide auditable evidence of customer-understanding metrics.',

    explicitOutOfScopeInput:
      'Wholesale and institutional clients are out of scope under Consumer Duty. Sub-advised funds where the firm is not the manufacturer are excluded.',
    knownDependenciesInput:
      'Data Lake refresh programme; CRM migration; FCA SM&CR review cycle.',
    keyAssumptionsInput:
      'FCA timelines remain firm. Customer data quality sufficient for outcomes testing. No further regulatory clarifications materially change scope.',
    keyConstraintsInput:
      'Hard regulatory deadline. No tolerance for partial compliance. Board oversight committee meets monthly.',

    resourceModelSelect: 'system_integrator_led',
    keyRolesRequiredMultiselect: [
      'sponsor_sro',
      'project_manager',
      'business_analyst',
      'governance_assurance_lead',
      'risk_control_lead',
      'data_migration_lead',
      'pmo',
    ],
    stakeholderGroupsMultiselect: [
      'executive_sponsor',
      'steering_committee',
      'risk_compliance',
      'business_process_owners',
      'technology_architecture',
      'data_reporting_mi',
      'pmo_governance',
    ],
    budgetConfidenceSelect: 'finance_reviewed_range',
    budgetNotesInput: 'Estimate prepared by external Big-4 advisory partner. +/- 15%.',
    qualityAssuranceExpectationsInput:
      'Three lines of defence model. Independent assurance by Internal Audit. External legal review of disclosures. Board sub-committee sign-off at each gate.',

    deliveryModelGroupSelect: '61472092-3bd3-46ad-9852-96fcfdea5d9b',
    preferredDeliveryModelSelect: '4bad432f-a8f4-45ea-b20e-cdf452798b13',
    deliveryModelCustomInput: '',
  }
}
