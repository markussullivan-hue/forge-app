// Step 2 — Dimensions & Scope.
// Mirrors classic /context/linked-classic-app/src/containerScopeDimensions.rsx.
// Captures scale/complexity/readiness, business drivers, impacted functions,
// lifecycle stage (conditional on preferred delivery model), and POTI x4
// scope checkbox groups.

import { useEffect, useMemo } from 'react'
import { Label } from '../../lib/shadcn/label'
import { Checkbox } from '../../lib/shadcn/checkbox'
import { RadioGroup, RadioGroupItem } from '../../lib/shadcn/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../lib/shadcn/select'
import {
  useGetCreateBusinessDrivers,
  useGetCreateFunctions,
  useGetCreateLifecycleStage,
  useGetCreateOrgFamiliarity,
  useGetCreateScale,
  useGetCreatComplexityLevels,
  useGetDeliveryModelsForGroup,
  useGetOsScopeInformationOptions,
  useGetOsScopeOrganisationOptions,
  useGetOsScopeProcessesOptions,
  useGetOsScopeTechnologyOptions,
} from '../../hooks/backend/wizard/lookups'
import { useWizardState } from './wizardState'
import { MultiSelect } from './MultiSelect'
import { FieldGuidance } from './FieldGuidance'

type LookupRowWithLabel = { id?: number; label: string; value?: string }
type PotiRow = { id: number; label: string; value: string; help_text?: string | null }
type DeliveryModelRow = {
  value: string
  label: string
  model_code: string | null
  group_code: string | null
}

/**
 * Mirrors the JSON spec's `hiddenWhen` for selectLifeCycleStage:
 *   !preferredDeliveryModelSelect.value
 *   || typeof preferredDeliveryModelSelect.value !== 'string'
 *   || preferredDeliveryModelSelect.selectedItem?.group_code === 'PROGRAMME_PORTFOLIO'
 */
export function isLifecycleStageVisible(
  preferredDeliveryModel: string | null,
  models: DeliveryModelRow[],
): boolean {
  if (!preferredDeliveryModel || typeof preferredDeliveryModel !== 'string') return false
  const row = models.find((m) => m.value === preferredDeliveryModel)
  if (!row) return false
  return row.group_code !== 'PROGRAMME_PORTFOLIO'
}

export default function Step2DimensionsScope() {
  const ws = useWizardState()

  // ---- Lookups -----------------------------------------------------------
  const scales = useGetCreateScale()
  const complexities = useGetCreatComplexityLevels()
  const readiness = useGetCreateOrgFamiliarity()
  const businessDrivers = useGetCreateBusinessDrivers()
  const functions = useGetCreateFunctions()
  const lifecycle = useGetCreateLifecycleStage()
  const deliveryModels = useGetDeliveryModelsForGroup()
  const potiProcesses = useGetOsScopeProcessesOptions()
  const potiOrganisation = useGetOsScopeOrganisationOptions()
  const potiTechnology = useGetOsScopeTechnologyOptions()
  const potiInformation = useGetOsScopeInformationOptions()

  useEffect(() => {
    scales.trigger()
    complexities.trigger()
    readiness.trigger()
    businessDrivers.trigger()
    functions.trigger()
    potiProcesses.trigger()
    potiOrganisation.trigger()
    potiTechnology.trigger()
    potiInformation.trigger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refetch lifecycle phases / delivery models whenever upstream selection
  // changes (the upstream selectors live on Step 3, but the user may
  // navigate back to Step 2 after picking them).
  useEffect(() => {
    if (ws.preferredDeliveryModelSelect) {
      lifecycle.trigger({ deliveryModelId: ws.preferredDeliveryModelSelect })
    } else {
      lifecycle.trigger({ deliveryModelId: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.preferredDeliveryModelSelect])

  useEffect(() => {
    if (ws.deliveryModelGroupSelect) {
      deliveryModels.trigger({ groupValue: ws.deliveryModelGroupSelect })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.deliveryModelGroupSelect])

  // ---- Derived -----------------------------------------------------------
  const driverOptions = useMemo(
    () =>
      ((businessDrivers.data ?? []) as LookupRowWithLabel[]).map((r) => ({
        value: r.label,
        label: r.label,
      })),
    [businessDrivers.data],
  )

  const functionOptions = useMemo(
    () =>
      ((functions.data ?? []) as LookupRowWithLabel[]).map((r) => ({
        value: r.label,
        label: r.label,
      })),
    [functions.data],
  )

  const lifecycleOptions = useMemo(
    () => (lifecycle.data ?? []) as { id: string | number; label: string }[],
    [lifecycle.data],
  )

  const modelRows = useMemo(
    () => (deliveryModels.data ?? []) as DeliveryModelRow[],
    [deliveryModels.data],
  )

  const lifecycleVisible = isLifecycleStageVisible(
    ws.preferredDeliveryModelSelect,
    modelRows,
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Dimensions &amp; Scope</h3>
        <p className="text-sm text-muted-foreground">
          Profile the initiative so the charter is sized and pitched
          appropriately. Lifecycle Stage appears once a delivery framework has
          been chosen on the Context &amp; Systems step.
        </p>
      </div>

      {/* Radios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RadioCard
          label="Organisational Readiness"
          options={(readiness.data ?? []) as LookupRowWithLabel[]}
          value={ws.radioGroupReadiness}
          onChange={(v) => ws.setWizardState({ radioGroupReadiness: v })}
          guidanceId="radioGroupReadiness"
        />
        <RadioCard
          label="Scale"
          options={(scales.data ?? []) as LookupRowWithLabel[]}
          value={ws.radioGroupScale}
          onChange={(v) => ws.setWizardState({ radioGroupScale: v })}
          guidanceId="radioGroupScale"
        />
        <RadioCard
          label="Complexity"
          options={(complexities.data ?? []) as LookupRowWithLabel[]}
          value={ws.radioGroupComplexity}
          onChange={(v) => ws.setWizardState({ radioGroupComplexity: v })}
          guidanceId="radioGroupComplexity"
        />
      </div>

      {/* Multiselects + Lifecycle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label>
            Business Drivers <span className="text-destructive">*</span>
          </Label>
          <MultiSelect<string>
            options={driverOptions}
            value={ws.multiselectBusinessDrivers}
            onChange={(next) =>
              ws.setWizardState({ multiselectBusinessDrivers: next })
            }
            placeholder="Select drivers"
          />
          <FieldGuidance id="multiselectBusinessDrivers" />
        </div>

        <div className="space-y-1.5">
          <Label>
            Impacted Functions <span className="text-destructive">*</span>
          </Label>
          <MultiSelect<string>
            options={functionOptions}
            value={ws.multiselectImpactedFunctions}
            onChange={(next) =>
              ws.setWizardState({ multiselectImpactedFunctions: next })
            }
            placeholder="Select functions"
          />
          <FieldGuidance id="multiselectImpactedFunctions" />
        </div>

        {lifecycleVisible ? (
          <div className="space-y-1.5 md:col-span-2">
            <Label>
              Lifecycle Stage <span className="text-destructive">*</span>
            </Label>
            <Select
              {...(ws.selectLifeCycleStage ? { value: ws.selectLifeCycleStage } : {})}
              onValueChange={(v) =>
                ws.setWizardState({ selectLifeCycleStage: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lifecycle stage" />
              </SelectTrigger>
              <SelectContent>
                {lifecycleOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No lifecycle phases for this framework.
                  </div>
                ) : (
                  lifecycleOptions.map((opt) => (
                    <SelectItem key={String(opt.id)} value={opt.label}>
                      {opt.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FieldGuidance id="selectLifeCycleStage" />
          </div>
        ) : null}
      </div>

      {/* POTI scope */}
      <div className="space-y-2">
        <h4 className="font-semibold">POTI Scope</h4>
        <p className="text-xs text-muted-foreground">
          The POTI model breaks the future state into Processes, Organisation,
          Technology, and Information. Select what is in scope for this
          initiative.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PotiCheckboxGroup
          title="Processes"
          required
          options={(potiProcesses.data ?? []) as PotiRow[]}
          value={ws.checkboxGroupPOTIProcesses}
          onChange={(v) => ws.setWizardState({ checkboxGroupPOTIProcesses: v })}
        />
        <PotiCheckboxGroup
          title="Organisation"
          required
          options={(potiOrganisation.data ?? []) as PotiRow[]}
          value={ws.checkboxGroupPOTIOrganisation}
          onChange={(v) =>
            ws.setWizardState({ checkboxGroupPOTIOrganisation: v })
          }
        />
        <PotiCheckboxGroup
          title="Technology"
          required
          options={(potiTechnology.data ?? []) as PotiRow[]}
          value={ws.checkboxGroupPOTITechnology}
          onChange={(v) =>
            ws.setWizardState({ checkboxGroupPOTITechnology: v })
          }
        />
        <PotiCheckboxGroup
          title="Information"
          required
          options={(potiInformation.data ?? []) as PotiRow[]}
          value={ws.checkboxGroupPOTIInformation}
          onChange={(v) =>
            ws.setWizardState({ checkboxGroupPOTIInformation: v })
          }
        />
      </div>
    </div>
  )
}

// ---- Helpers --------------------------------------------------------------

function RadioCard({
  label,
  options,
  value,
  onChange,
  guidanceId,
}: {
  label: string
  options: LookupRowWithLabel[]
  value: string
  onChange: (next: string) => void
  guidanceId?: string
}) {
  return (
    <div className="space-y-2 rounded-lg border border-border p-4">
      <Label>
        {label} <span className="text-destructive">*</span>
      </Label>
      <RadioGroup value={value} onValueChange={onChange} className="gap-2">
        {options.map((opt) => (
          <label
            key={String(opt.id ?? opt.label)}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <RadioGroupItem value={opt.label} id={`${label}-${opt.label}`} />
            <span>{opt.label}</span>
          </label>
        ))}
      </RadioGroup>
      {guidanceId ? <FieldGuidance id={guidanceId} /> : null}
    </div>
  )
}

function PotiCheckboxGroup({
  title,
  options,
  value,
  onChange,
  required,
}: {
  title: string
  options: { label: string; value: string }[]
  value: string[]
  onChange: (next: string[]) => void
  required?: boolean
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v))
    else onChange([...value, v])
  }
  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <Label>
        {title} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {options.map((opt) => {
            const checked = value.includes(opt.value)
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
