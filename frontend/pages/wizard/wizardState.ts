// Tiny pub/sub store for the charter-generation wizard.
// Mirrors the classic Retool wizard state — Step 1 fields are exposed today;
// Step 2/3 fields are part of the shape so future phases can fill them in
// without changing the API consumed by Step 1.

import { useEffect, useState } from 'react'

export type GenerationStatus = 'idle' | 'confirming' | 'running' | 'complete' | 'error'

export type SystemSelection = {
  rowId: string
  systemId: number | null
  customSystemName: string
  categoryId: number | string | null
  categoryCode: string | null
  impactBucketCode: string | null
  note: string
}

export type WizardState = {
  // ---- Step 1: Initiative Overview ----------------------------------------
  initiativeName: string
  initiativeDescription: string
  initiativeBudget: number | null
  initiativeTargetStartDate: string // ISO yyyy-mm-dd
  initiativeTargetEndDate: string // ISO yyyy-mm-dd
  initiativeServiceIndustrySelect: number[] // os_service_industry_type.id list
  radioGroupScale: string
  radioGroupComplexity: string
  radioGroupReadiness: string
  multiselectBusinessDrivers: string[]
  multiselectImpactedFunctions: string[]
  selectLifeCycleStage: string
  budgetConfidenceSelect: string | null
  stakeholderGroupsMultiselect: string[]

  // ---- Step 2: Context & Systems (filled in next phase) ------------------
  textInputStrategicObjectives: string
  textInputBusinessProblem: string
  checkboxGroupPOTIProcesses: string[]
  checkboxGroupPOTIOrganisation: string[]
  checkboxGroupPOTITechnology: string[]
  checkboxGroupPOTIInformation: string[]
  deliveryModelGroupSelect: string | null
  preferredDeliveryModelSelect: string | null
  deliveryModelCustomInput: string
  systemsSelection: SystemSelection[]

  // ---- Step 3: Review / business case (filled in next phase) -------------
  explicitOutOfScopeInput: string
  knownDependenciesInput: string
  keyAssumptionsInput: string
  keyConstraintsInput: string
  resourceModelSelect: string | null
  keyRolesRequiredMultiselect: string[]
  budgetNotesInput: string
  qualityAssuranceExpectationsInput: string

  // ---- Wizard flow state -------------------------------------------------
  currentStep: 1 | 2 | 3 | 4 | 5
  generationStatus: GenerationStatus
  generationStartedAt: string | null
  generationResult: unknown
  generationError: string | null
  currentRunId: string | null
}

export const INITIAL_WIZARD_STATE: WizardState = {
  initiativeName: '',
  initiativeDescription: '',
  initiativeBudget: null,
  initiativeTargetStartDate: '',
  initiativeTargetEndDate: '',
  initiativeServiceIndustrySelect: [],
  radioGroupScale: '',
  radioGroupComplexity: '',
  radioGroupReadiness: '',
  multiselectBusinessDrivers: [],
  multiselectImpactedFunctions: [],
  selectLifeCycleStage: '',
  budgetConfidenceSelect: null,
  stakeholderGroupsMultiselect: [],

  textInputStrategicObjectives: '',
  textInputBusinessProblem: '',
  checkboxGroupPOTIProcesses: [],
  checkboxGroupPOTIOrganisation: [],
  checkboxGroupPOTITechnology: [],
  checkboxGroupPOTIInformation: [],
  deliveryModelGroupSelect: null,
  preferredDeliveryModelSelect: null,
  deliveryModelCustomInput: '',
  systemsSelection: [],

  explicitOutOfScopeInput: '',
  knownDependenciesInput: '',
  keyAssumptionsInput: '',
  keyConstraintsInput: '',
  resourceModelSelect: null,
  keyRolesRequiredMultiselect: [],
  budgetNotesInput: '',
  qualityAssuranceExpectationsInput: '',

  currentStep: 1,
  generationStatus: 'idle',
  generationStartedAt: null,
  generationResult: null,
  generationError: null,
  currentRunId: null,
}

type Listener = (state: WizardState) => void

let state: WizardState = { ...INITIAL_WIZARD_STATE }
const listeners = new Set<Listener>()

function notify(): void {
  for (const listener of listeners) listener(state)
}

export function getWizardState(): WizardState {
  return state
}

export function setWizardState(patch: Partial<WizardState>): void {
  state = { ...state, ...patch }
  notify()
}

export function resetWizardState(): void {
  state = { ...INITIAL_WIZARD_STATE }
  notify()
}

export function useWizardState(): WizardState & {
  setWizardState: (patch: Partial<WizardState>) => void
  resetWizardState: () => void
} {
  const [snapshot, setSnapshot] = useState<WizardState>(state)
  useEffect(() => {
    const unsub = (s: WizardState) => setSnapshot(s)
    listeners.add(unsub)
    return () => {
      listeners.delete(unsub)
    }
  }, [])
  return { ...snapshot, setWizardState, resetWizardState }
}
