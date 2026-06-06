// Step 3 — Review & Confirm. Ports the read-only summary from
// /context/linked-classic-app/lib/wizardReviewModel.js plus the section
// containers in steppedContainerHomepage.rsx.

import { useEffect, useMemo } from 'react'
import {
  useGetCreateBusinessDrivers,
  useGetCreateFunctions,
  useGetCreateLifecycleStage,
  useGetCreateServiceIndustryType,
  useGetDeliveryModelGroups,
  useGetDeliveryModelsForGroup,
  useGetImpactBuckets,
  useGetKeyRoleOptions,
  useGetResourceModelOptions,
  useGetStakeholderGroupOptions,
  useGetSystemCategories,
  useGetSystems,
  useGetBudgetConfidenceOptions,
} from '../../hooks/backend/wizard/lookups'
import { useWizardState } from './wizardState'

function isBlank(v: unknown): boolean {
  if (v === null || v === undefined) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  return false
}

function fmtDate(v: string): string | null {
  if (!v) return null
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString('en-GB')
}

function fmtMoney(v: number | null): string | null {
  if (v == null) return null
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(v)
}

function fmtArray(arr: unknown): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null
  return arr.map((x) => String(x)).join(', ')
}

type Section = {
  title: string
  rows: Array<{ label: string; value: string | null }>
}

export default function Step3Review() {
  const ws = useWizardState()

  // ---- Lookups for labels -----------------------------------------------
  const industries = useGetCreateServiceIndustryType()
  const drivers = useGetCreateBusinessDrivers()
  const functions = useGetCreateFunctions()
  const lifecycle = useGetCreateLifecycleStage()
  const groups = useGetDeliveryModelGroups()
  const models = useGetDeliveryModelsForGroup()
  const stakeholders = useGetStakeholderGroupOptions()
  const keyRoles = useGetKeyRoleOptions()
  const resourceModels = useGetResourceModelOptions()
  const budgetConfidence = useGetBudgetConfidenceOptions()
  const categories = useGetSystemCategories()
  const systems = useGetSystems()
  const impactBuckets = useGetImpactBuckets()

  useEffect(() => {
    industries.trigger()
    drivers.trigger()
    functions.trigger()
    groups.trigger()
    stakeholders.trigger()
    keyRoles.trigger()
    resourceModels.trigger()
    budgetConfidence.trigger()
    categories.trigger()
    systems.trigger({ categoryId: null })
    impactBuckets.trigger()
    if (ws.preferredDeliveryModelSelect) {
      lifecycle.trigger({ deliveryModelId: ws.preferredDeliveryModelSelect })
    }
    if (ws.deliveryModelGroupSelect) {
      models.trigger({ groupValue: ws.deliveryModelGroupSelect })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Label resolvers ---------------------------------------------------
  const industryLabels = useMemo(() => {
    const rows = (industries.data ?? []) as Array<{ id: number; label: string }>
    const map = new Map<number, string>()
    for (const r of rows) map.set(Number(r.id), r.label)
    return ws.initiativeServiceIndustrySelect
      .map((id) => map.get(Number(id)))
      .filter((v): v is string => Boolean(v))
  }, [industries.data, ws.initiativeServiceIndustrySelect])

  const lifecycleLabel = useMemo(() => {
    const rows = (lifecycle.data ?? []) as Array<{ id: string; label: string }>
    const found = rows.find(
      (r) => r.id === ws.selectLifeCycleStage || r.label === ws.selectLifeCycleStage,
    )
    return found?.label ?? ws.selectLifeCycleStage ?? null
  }, [lifecycle.data, ws.selectLifeCycleStage])

  const groupLabel = useMemo(() => {
    const rows = (groups.data ?? []) as Array<{ value: string; label: string }>
    return rows.find((r) => r.value === ws.deliveryModelGroupSelect)?.label ?? null
  }, [groups.data, ws.deliveryModelGroupSelect])

  const modelLabel = useMemo(() => {
    const rows = (models.data ?? []) as Array<{ value: string; label: string; model_code: string | null }>
    return rows.find((r) => r.value === ws.preferredDeliveryModelSelect)?.label ?? null
  }, [models.data, ws.preferredDeliveryModelSelect])

  const isCustom = useMemo(() => {
    const rows = (models.data ?? []) as Array<{ value: string; model_code: string | null }>
    return rows.find((r) => r.value === ws.preferredDeliveryModelSelect)?.model_code === 'CUSTOM'
  }, [models.data, ws.preferredDeliveryModelSelect])

  const stakeholderLabels = useMemo(() => {
    const rows = (stakeholders.data ?? []) as Array<{ value: string; label: string }>
    const map = new Map(rows.map((r) => [r.value, r.label]))
    return ws.stakeholderGroupsMultiselect.map((v) => map.get(v) ?? v)
  }, [stakeholders.data, ws.stakeholderGroupsMultiselect])

  const keyRoleLabels = useMemo(() => {
    const rows = (keyRoles.data ?? []) as Array<{ value: string; label: string }>
    const map = new Map(rows.map((r) => [r.value, r.label]))
    return ws.keyRolesRequiredMultiselect.map((v) => map.get(v) ?? v)
  }, [keyRoles.data, ws.keyRolesRequiredMultiselect])

  const resourceModelLabel = useMemo(() => {
    const rows = (resourceModels.data ?? []) as Array<{ value: string; label: string }>
    return rows.find((r) => r.value === ws.resourceModelSelect)?.label ?? ws.resourceModelSelect ?? null
  }, [resourceModels.data, ws.resourceModelSelect])

  const budgetConfidenceLabel = useMemo(() => {
    const rows = (budgetConfidence.data ?? []) as Array<{ value: string; label: string }>
    return rows.find((r) => r.value === ws.budgetConfidenceSelect)?.label ?? ws.budgetConfidenceSelect ?? null
  }, [budgetConfidence.data, ws.budgetConfidenceSelect])

  const systemsSummary = useMemo(() => {
    const catMap = new Map<number, string>()
    for (const c of (categories.data ?? []) as Array<{ category_id: number; category_name: string }>) {
      catMap.set(Number(c.category_id), c.category_name)
    }
    const sysMap = new Map<number, string>()
    for (const s of (systems.data ?? []) as Array<{ system_id: number; system_name: string }>) {
      sysMap.set(s.system_id, s.system_name)
    }
    const buckMap = new Map<string, string>()
    for (const b of (impactBuckets.data ?? []) as Array<{ code: string; display_label: string }>) {
      buckMap.set(b.code, b.display_label)
    }
    return ws.systemsSelection.map((row) => {
      const catName = catMap.get(Number(row.categoryId)) ?? 'Category'
      const sysName =
        row.systemId !== null
          ? sysMap.get(row.systemId) ?? `System #${row.systemId}`
          : row.customSystemName || 'Other'
      const bucket = buckMap.get(row.impactBucketCode ?? '') ?? row.impactBucketCode ?? ''
      return `${catName}: ${sysName} — ${bucket}`
    })
  }, [categories.data, systems.data, impactBuckets.data, ws.systemsSelection])

  const sections: Section[] = [
    {
      title: 'Overview',
      rows: [
        { label: 'Initiative name', value: isBlank(ws.initiativeName) ? null : ws.initiativeName },
        {
          label: 'Description',
          value: isBlank(ws.initiativeDescription) ? null : ws.initiativeDescription,
        },
        { label: 'Estimated budget', value: fmtMoney(ws.initiativeBudget) },
        { label: 'Target start date', value: fmtDate(ws.initiativeTargetStartDate) },
        { label: 'Target end date', value: fmtDate(ws.initiativeTargetEndDate) },
        { label: 'Service industry', value: fmtArray(industryLabels) },
      ],
    },
    {
      title: 'Dimensions & Scope',
      rows: [
        { label: 'Scale', value: isBlank(ws.radioGroupScale) ? null : ws.radioGroupScale },
        { label: 'Complexity', value: isBlank(ws.radioGroupComplexity) ? null : ws.radioGroupComplexity },
        { label: 'Organisational readiness', value: isBlank(ws.radioGroupReadiness) ? null : ws.radioGroupReadiness },
        { label: 'Lifecycle stage', value: lifecycleLabel },
        { label: 'Business drivers', value: fmtArray(ws.multiselectBusinessDrivers) },
        { label: 'Impacted functions', value: fmtArray(ws.multiselectImpactedFunctions) },
        { label: 'Processes in scope', value: fmtArray(ws.checkboxGroupPOTIProcesses) },
        { label: 'Organisation in scope', value: fmtArray(ws.checkboxGroupPOTIOrganisation) },
        { label: 'Technology in scope', value: fmtArray(ws.checkboxGroupPOTITechnology) },
        { label: 'Information in scope', value: fmtArray(ws.checkboxGroupPOTIInformation) },
      ],
    },
    {
      title: 'Context & Systems',
      rows: [
        { label: 'Business problem', value: isBlank(ws.textInputBusinessProblem) ? null : ws.textInputBusinessProblem },
        { label: 'Strategic objectives', value: isBlank(ws.textInputStrategicObjectives) ? null : ws.textInputStrategicObjectives },
        { label: 'Selected systems', value: fmtArray(systemsSummary) },
      ],
    },
    {
      title: 'Delivery method / governance approach',
      rows: [
        { label: 'Group', value: groupLabel },
        { label: 'Preferred framework / method', value: modelLabel },
        ...(isCustom
          ? [{ label: 'Custom framework / method', value: isBlank(ws.deliveryModelCustomInput) ? null : ws.deliveryModelCustomInput }]
          : []),
      ],
    },
    {
      title: 'Business Case Detail',
      rows: [
        { label: 'Explicit out of scope', value: isBlank(ws.explicitOutOfScopeInput) ? null : ws.explicitOutOfScopeInput },
        { label: 'Known dependencies', value: isBlank(ws.knownDependenciesInput) ? null : ws.knownDependenciesInput },
        { label: 'Key assumptions', value: isBlank(ws.keyAssumptionsInput) ? null : ws.keyAssumptionsInput },
        { label: 'Key constraints', value: isBlank(ws.keyConstraintsInput) ? null : ws.keyConstraintsInput },
        { label: 'Resource model', value: resourceModelLabel },
        { label: 'Key roles required', value: fmtArray(keyRoleLabels) },
        { label: 'Stakeholder groups', value: fmtArray(stakeholderLabels) },
        { label: 'Budget confidence', value: budgetConfidenceLabel },
        { label: 'Budget notes', value: isBlank(ws.budgetNotesInput) ? null : ws.budgetNotesInput },
        {
          label: 'Quality / assurance expectations',
          value: isBlank(ws.qualityAssuranceExpectationsInput) ? null : ws.qualityAssuranceExpectationsInput,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Review & confirm</h3>
        <p className="text-sm text-muted-foreground">
          Review the information below before generating the charter. Confirm it
          is complete, accurate, and ready for final output. Optional blank
          fields are omitted.
        </p>
      </div>

      {sections.map((section) => {
        const visibleRows = section.rows.filter((r) => !isBlank(r.value))
        if (visibleRows.length === 0) return null
        return (
          <div key={section.title} className="rounded-lg border border-border bg-card">
            <div className="px-4 py-2 border-b border-border">
              <h4 className="font-semibold">{section.title}</h4>
            </div>
            <dl className="divide-y divide-border">
              {visibleRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-4 py-2"
                >
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="sm:col-span-2 text-sm whitespace-pre-wrap break-words">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}
    </div>
  )
}
