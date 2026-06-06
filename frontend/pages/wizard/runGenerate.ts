// Charter wizard create + generate orchestration. Composes the backend
// triggers and updates global app/wizard state. Identity for createProject is
// the login credential id (forgeUserId / session.id).

import { setAppState } from '../../utils/appState'
import { setWizardState, type WizardState } from './wizardState'

type TriggerResult<T = unknown> = T | { result: Promise<T> }
export type Trigger = (params?: Record<string, unknown>) => unknown

async function awaitTrigger<T>(trigger: Trigger, params?: Record<string, unknown>): Promise<T> {
  const handle = trigger(params) as TriggerResult<T>
  if (handle && typeof handle === 'object' && 'result' in handle) {
    return (handle as { result: Promise<T> }).result
  }
  return Promise.resolve(handle as T)
}

function generateProjectCode(): string {
  const chars = '0123456789ABCDEF'
  let s = ''
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * 16)]
  return `PRJ-${s}`
}

export function buildCreateProjectParams(
  ws: WizardState,
  industryRows: Array<{ id: number; label: string }>,
  forgeUserId: string,
): Record<string, unknown> {
  const industryMap = new Map<number, string>()
  for (const r of industryRows) industryMap.set(Number(r.id), r.label)
  const labels = ws.initiativeServiceIndustrySelect
    .map((id) => industryMap.get(Number(id)))
    .filter((v): v is string => Boolean(v))
  const serviceIndustryText = labels.join(', ')

  return {
    forgeUserId,
    initiativeName: ws.initiativeName,
    initiativeDescription: ws.initiativeDescription,
    initiativeBudget: ws.initiativeBudget,
    initiativeTargetStartDate: ws.initiativeTargetStartDate,
    initiativeTargetEndDate: ws.initiativeTargetEndDate,
    serviceIndustryText,
    radioGroupReadiness: ws.radioGroupReadiness,
    radioGroupScale: ws.radioGroupScale,
    radioGroupComplexity: ws.radioGroupComplexity,
    multiselectBusinessDrivers: ws.multiselectBusinessDrivers,
    multiselectImpactedFunctions: ws.multiselectImpactedFunctions,
    deliveryModelId: ws.preferredDeliveryModelSelect ?? '',
    selectLifeCycleStage: ws.selectLifeCycleStage,
    projectCode: generateProjectCode(),
  }
}

export function buildCreateProjectContextParams(
  ws: WizardState,
  projectId: string,
  orgId: string,
  forgeUserId: string,
): Record<string, unknown> {
  return {
    forgeUserId,
    projectId,
    orgId,
    textInputBusinessProblem: ws.textInputBusinessProblem,
    textInputStrategicObjectives: ws.textInputStrategicObjectives,
    explicitOutOfScopeInput: ws.explicitOutOfScopeInput,
    knownDependenciesInput: ws.knownDependenciesInput,
    keyAssumptionsInput: ws.keyAssumptionsInput,
    keyConstraintsInput: ws.keyConstraintsInput,
    resourceModelSelect: ws.resourceModelSelect,
    keyRolesRequiredMultiselect: ws.keyRolesRequiredMultiselect,
    stakeholderGroupsMultiselect: ws.stakeholderGroupsMultiselect,
    budgetConfidenceSelect: ws.budgetConfidenceSelect,
    budgetNotesInput: ws.budgetNotesInput,
    qualityAssuranceExpectationsInput: ws.qualityAssuranceExpectationsInput,
    checkboxGroupPOTIProcesses: ws.checkboxGroupPOTIProcesses,
    checkboxGroupPOTIOrganisation: ws.checkboxGroupPOTIOrganisation,
    checkboxGroupPOTITechnology: ws.checkboxGroupPOTITechnology,
    checkboxGroupPOTIInformation: ws.checkboxGroupPOTIInformation,
    deliveryModelGroupSelect: ws.deliveryModelGroupSelect,
    preferredDeliveryModelSelect: ws.preferredDeliveryModelSelect,
    deliveryModelCustomInput: ws.deliveryModelCustomInput,
  }
}

export function buildCreateProjectSystemsParams(
  ws: WizardState,
  projectId: string,
  orgId: string,
  forgeUserId: string,
): Record<string, unknown> {
  return {
    forgeUserId,
    projectId,
    orgId,
    selections: ws.systemsSelection.map((r) => ({
      categoryId: r.categoryId,
      systemId: r.systemId,
      customSystemName: r.customSystemName || null,
      impactBucketCode: r.impactBucketCode ?? 'in_scope',
      notes: r.note || null,
    })),
  }
}

export type CreateProjectResultLike = {
  projectId?: string
  orgId?: string
  project_id?: string
  org_id?: string
}

function extractProjectIds(result: unknown): { projectId: string; orgId: string } {
  const r = (result ?? {}) as CreateProjectResultLike & {
    project_id?: string | string[]
    org_id?: string | string[]
  }
  const projectId =
    r.projectId ??
    (Array.isArray(r.project_id) ? r.project_id[0] : r.project_id) ??
    ''
  const orgId =
    r.orgId ??
    (Array.isArray(r.org_id) ? r.org_id[0] : r.org_id) ??
    ''
  if (!projectId || !orgId) {
    throw new Error(`createProject returned no ids. Result: ${JSON.stringify(result)}`)
  }
  return { projectId, orgId }
}

export function describeError(err: unknown, fallback = 'Generation failed'): string {
  if (err == null) return fallback
  if (err instanceof Error && err.message) return err.message
  if (typeof err === 'string') return err
  try {
    const s = JSON.stringify(err)
    if (s && s !== '{}') return s
  } catch {
    /* ignore */
  }
  return fallback
}

export async function runCreateProjectFlow(opts: {
  ws: WizardState
  industries: Array<{ id: number; label: string }>
  forgeUserId: string
  triggers: {
    createProject: Trigger
    createProjectContext: Trigger
    createProjectSystems: Trigger
  }
}): Promise<{ projectId: string; orgId: string }> {
  const { ws, industries, forgeUserId, triggers } = opts

  // 1. createProject
  const cpResult = await awaitTrigger<unknown>(
    triggers.createProject,
    buildCreateProjectParams(ws, industries, forgeUserId),
  )
  const { projectId, orgId } = extractProjectIds(cpResult)

  setAppState({
    createdProjectId: projectId,
    createdOrgId: orgId,
    selectedProjectId: projectId,
    currentOrgId: orgId,
  })

// 2. createProjectContext
  await awaitTrigger<unknown>(
    triggers.createProjectContext,
    buildCreateProjectContextParams(ws, projectId, orgId, forgeUserId),
  )

  // 3. createProjectSystems
  await awaitTrigger<unknown>(
    triggers.createProjectSystems,
    buildCreateProjectSystemsParams(ws, projectId, orgId, forgeUserId),
  )

  setWizardState({ generationStatus: 'confirming' })
  return { projectId, orgId }
}

export async function runArtefactsGeneration(opts: {
  projectId: string
  orgId: string
  initiatedByUserId: string | null
  triggers: {
    runStagedGenerationPipeline: Trigger
  }
}): Promise<void> {
  if (!opts.orgId || !opts.projectId) {
    const missing: string[] = []
    if (!opts.orgId) missing.push('organisation id')
    if (!opts.projectId) missing.push('project id')
    throw new Error(`Wizard state incomplete (${missing.join(', ')} missing).`)
  }

  const startedAt = new Date(Date.now() - 5_000).toISOString()
  setWizardState({
    generationStartedAt: startedAt,
    currentRunId: null,
    generationError: null,
    generationResult: null,
    generationStatus: 'running',
  })

  await awaitTrigger<unknown>(opts.triggers.runStagedGenerationPipeline, {
    orgId: opts.orgId,
    projectId: opts.projectId,
    initiatedByUserId: opts.initiatedByUserId,
  })
}