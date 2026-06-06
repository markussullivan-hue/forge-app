// Step 2 — Context & Systems.
// Mirrors classic /context/linked-classic-app/src/steppedContainerHomepage.rsx
// (View labelled "Context & Systems", viewKey "Step 3").
//
// Captures: strategic objectives, business problem, delivery method/framework,
// POTI scope checkbox groups, system-type checkboxes, and the per-category
// systems picker with impact-bucket configuration.

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Input } from '../../lib/shadcn/input'
import { Label } from '../../lib/shadcn/label'
import { Textarea } from '../../lib/shadcn/textarea'
import { Checkbox } from '../../lib/shadcn/checkbox'
import { Button } from '../../lib/shadcn/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../lib/shadcn/select'
import {
  useGetDeliveryModelGroups,
  useGetDeliveryModelsForGroup,
  useGetImpactBuckets,
  useGetSystemCategories,
  useGetSystems,
} from '../../hooks/backend/wizard/lookups'
import { useWizardState, type SystemSelection } from './wizardState'
import { FieldGuidance } from './FieldGuidance'

// Banned-term validation ported from containerScopeDimensions / classic
// textInputStrategicObjectives.customValidation.
const STRATEGIC_BANNED_PATTERNS: RegExp[] = [
  /\breplace\b/i,
  /\breplacement\b/i,
  /\bupgrade\b/i,
  /\brebuild\b/i,
  /\bmigrate\b/i,
  /\bmigration\b/i,
  /\bdecommission\b/i,
  /\bretire\b/i,
  /\bimplement\b/i,
  /\bbuild\b/i,
  /\bengineer\b/i,
  /\benhance\b/i,
  /\boptimise\b/i,
  /\boptimize\b/i,
  /\bsolution\b/i,
  /\bsystem\b/i,
  /\bplatform\b/i,
  /\btool\b/i,
]

function validateStrategicObjective(raw: string): string {
  const v = (raw ?? '').trim()
  if (!v) return 'Enter a strategic objective.'
  if (STRATEGIC_BANNED_PATTERNS.some((re) => re.test(v))) {
    return 'Use a business outcome, not a solution statement. Remove words such as replace, upgrade, rebuild, migrate, implement, build, engineer, enhance, optimise, solution, system, platform or tool.'
  }
  return ''
}

type DeliveryGroupRow = {
  value: string
  label: string
  group_code: string | null
}
type DeliveryModelRow = {
  value: string
  label: string
  model_code: string | null
  group_code: string | null
}
type CategoryRow = { category_id: number | string; category_name: string; category_code?: string | null }
type SystemRow = { system_id: number; category_id: number; system_name: string }
type ImpactBucketRow = {
  code: string
  display_label: string
  short_description: string | null
}

export default function Step2ContextSystems() {
  const ws = useWizardState()

  // ---- Lookups -----------------------------------------------------------
  const deliveryGroups = useGetDeliveryModelGroups()
  const deliveryModels = useGetDeliveryModelsForGroup()
  const categories = useGetSystemCategories()
  const systems = useGetSystems()
  const impactBuckets = useGetImpactBuckets()

  // One-shot triggers on mount
  useEffect(() => {
    deliveryGroups.trigger()
    categories.trigger()
    systems.trigger({ categoryId: null })
    impactBuckets.trigger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-trigger models when group changes
  useEffect(() => {
    if (ws.deliveryModelGroupSelect) {
      deliveryModels.trigger({ groupValue: ws.deliveryModelGroupSelect })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.deliveryModelGroupSelect])

  // ---- Computed options --------------------------------------------------
  const groupOptions = useMemo(
    () => ((deliveryGroups.data ?? []) as DeliveryGroupRow[]),
    [deliveryGroups.data],
  )
  const modelOptions = useMemo(
    () => ((deliveryModels.data ?? []) as DeliveryModelRow[]),
    [deliveryModels.data],
  )
  const selectedModel = useMemo(
    () => modelOptions.find((m) => m.value === ws.preferredDeliveryModelSelect) ?? null,
    [modelOptions, ws.preferredDeliveryModelSelect],
  )

  const categoryRows = useMemo(
    () => ((categories.data ?? []) as CategoryRow[]),
    [categories.data],
  )
  const systemRows = useMemo(
    () => ((systems.data ?? []) as SystemRow[]),
    [systems.data],
  )
  const bucketRows = useMemo(
    () => ((impactBuckets.data ?? []) as ImpactBucketRow[]),
    [impactBuckets.data],
  )

  // ---- Systems summary counts -------------------------------------------
  const sel = ws.systemsSelection
  const inScopeCount = sel.filter((r) => r.impactBucketCode === 'in_scope').length
  const integrationCount = sel.filter((r) => r.impactBucketCode === 'integration_touchpoint').length
  const contextCount = sel.filter((r) => r.impactBucketCode === 'existing_context').length
  const totalSelected = sel.length
  const distinctCategories = new Set(sel.map((r) => r.categoryId)).size

  // ---- Category expand/collapse state -----------------------------------
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const toggleExpand = (catId: number | string) =>
    setExpanded((prev) => ({ ...prev, [String(catId)]: !prev[String(catId)] }))

  // ---- Validation surface -----------------------------------------------
  const strategicError = validateStrategicObjective(ws.textInputStrategicObjectives)
  const showStrategicError =
    ws.textInputStrategicObjectives.length > 0 && Boolean(strategicError)

  // ---- Selection mutators -----------------------------------------------
  const newRowId = () =>
    `row_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`

  const toggleSystem = (categoryId: number | string, system: SystemRow) => {
    const existing = sel.find(
      (r) => r.categoryId === categoryId && r.systemId === system.system_id,
    )
    if (existing) {
      ws.setWizardState({
        systemsSelection: sel.filter((r) => r.rowId !== existing.rowId),
      })
      return
    }
    const next: SystemSelection = {
      rowId: newRowId(),
      systemId: system.system_id,
      customSystemName: '',
      categoryId,
      categoryCode: null,
      impactBucketCode: 'in_scope',
      note: '',
    }
    ws.setWizardState({ systemsSelection: [...sel, next] })
  }

  const addOtherRow = (categoryId: number | string) => {
    const next: SystemSelection = {
      rowId: newRowId(),
      systemId: null,
      customSystemName: '',
      categoryId,
      categoryCode: null,
      impactBucketCode: 'in_scope',
      note: '',
    }
    ws.setWizardState({ systemsSelection: [...sel, next] })
  }

  const removeRow = (rowId: string) =>
    ws.setWizardState({
      systemsSelection: sel.filter((r) => r.rowId !== rowId),
    })

  const updateRow = (rowId: string, patch: Partial<SystemSelection>) =>
    ws.setWizardState({
      systemsSelection: sel.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)),
    })

  // Named rows by category for ticking checkboxes
  const isSystemChecked = (categoryId: number | string, systemId: number) =>
    sel.some((r) => r.categoryId === categoryId && r.systemId === systemId)

  const otherRowsByCategory = (categoryId: number | string) =>
    sel.filter((r) => r.categoryId === categoryId && r.systemId === null)

  const namedRowsCount = (categoryId: number | string) =>
    sel.filter((r) => r.categoryId === categoryId).length

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Context & Systems</h3>
        <p className="text-sm text-muted-foreground">
          Capture the business context, operating environment, and key systems affected.
          This provides the delivery backdrop and will be refined later.
        </p>
      </div>

      {/* Strategic objectives + business problem */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-1.5">
          <Label htmlFor="textInputStrategicObjectives">
            Strategic Objectives <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="textInputStrategicObjectives"
            placeholder="We want to achieve <target outcome>"
            value={ws.textInputStrategicObjectives}
            onChange={(e) =>
              ws.setWizardState({ textInputStrategicObjectives: e.target.value })
            }
            rows={3}
          />
          {showStrategicError ? (
            <p className="text-xs text-destructive">{strategicError}</p>
          ) : (
            <FieldGuidance id="textInputStrategicObjectives" />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="textInputBusinessProblem">
            Business Problem <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="textInputBusinessProblem"
            placeholder="The business is facing <problem>, causing <impact>"
            value={ws.textInputBusinessProblem}
            onChange={(e) =>
              ws.setWizardState({ textInputBusinessProblem: e.target.value })
            }
            rows={3}
          />
          <FieldGuidance id="textInputBusinessProblem" />
        </div>
      </div>

      {/* Delivery method / framework */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label>
            Delivery method / governance approach <span className="text-destructive">*</span>
          </Label>
          <Select
            {...(ws.deliveryModelGroupSelect
              ? { value: ws.deliveryModelGroupSelect }
              : {})}
            onValueChange={(v) =>
              ws.setWizardState({
                deliveryModelGroupSelect: v,
                preferredDeliveryModelSelect: null,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select the broad method / framework family" />
            </SelectTrigger>
            <SelectContent>
              {groupOptions.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>
            Preferred framework / method <span className="text-destructive">*</span>
          </Label>
          <Select
            {...(ws.preferredDeliveryModelSelect
              ? { value: ws.preferredDeliveryModelSelect }
              : {})}
            onValueChange={(v) =>
              ws.setWizardState({ preferredDeliveryModelSelect: v })
            }
            disabled={!ws.deliveryModelGroupSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select the specific framework or method" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Pick a delivery method first.
                </div>
              ) : (
                modelOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedModel?.model_code === 'CUSTOM' ? (
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="deliveryModelCustomInput">Custom framework / method name</Label>
            <Input
              id="deliveryModelCustomInput"
              placeholder="Enter the organisation-specific, client-specific, or blended framework/method name"
              value={ws.deliveryModelCustomInput}
              onChange={(e) =>
                ws.setWizardState({ deliveryModelCustomInput: e.target.value })
              }
            />
          </div>
        ) : null}
      </div>

      {/* Systems picker */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h4 className="font-semibold">Systems</h4>
          <div className="text-xs text-muted-foreground">
            {inScopeCount} in scope · {integrationCount} integration · {contextCount} context
            <span className="mx-2">·</span>
            {totalSelected} systems selected across {distinctCategories} categories
          </div>
        </div>

        {categoryRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading categories…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryRows.map((cat) => {
              const isOpen = expanded[String(cat.category_id)] ?? false
              const catSystems = systemRows.filter(
                (s) => s.category_id === Number(cat.category_id),
              )
              const others = otherRowsByCategory(cat.category_id)
              return (
                <div
                  key={String(cat.category_id)}
                  className="rounded-lg border border-border bg-card"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(cat.category_id)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left"
                  >
                    <span className="font-medium text-sm">{cat.category_name}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      #{namedRowsCount(cat.category_id)}
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="px-3 pb-3 space-y-2 border-t border-border">
                      {catSystems.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">
                          No systems for this category.
                        </p>
                      ) : (
                        <div className="space-y-1.5 pt-2 max-h-56 overflow-y-auto">
                          {catSystems.map((s) => {
                            const checked = isSystemChecked(cat.category_id, s.system_id)
                            return (
                              <label
                                key={s.system_id}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => toggleSystem(cat.category_id, s)}
                                />
                                <span>{s.system_name}</span>
                              </label>
                            )
                          })}
                        </div>
                      )}

                      {/* Other rows */}
                      {others.map((row) => (
                        <div key={row.rowId} className="flex items-center gap-2">
                          <Input
                            value={row.customSystemName}
                            placeholder="Other system name"
                            onChange={(e) =>
                              updateRow(row.rowId, { customSystemName: e.target.value })
                            }
                            className="h-8 text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(row.rowId)}
                            aria-label="Remove other system"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOtherRow(cat.category_id)}
                        className="w-full"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add other
                      </Button>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Configure selected systems */}
      {sel.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-semibold">Configure selected systems</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sel.map((row) => {
              const cat = categoryRows.find(
                (c) => Number(c.category_id) === Number(row.categoryId),
              )
              const sys =
                row.systemId !== null
                  ? systemRows.find((s) => s.system_id === row.systemId)
                  : null
              return (
                <div
                  key={row.rowId}
                  className="rounded-lg border border-border p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {cat?.category_name ?? 'Category'}
                      </p>
                      <p className="font-medium text-sm">
                        {sys?.system_name ?? row.customSystemName ?? 'Other'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(row.rowId)}
                      aria-label="Remove system"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Impact bucket */}
                  <div className="flex flex-wrap gap-1">
                    {bucketRows.map((b) => {
                      const active = row.impactBucketCode === b.code
                      return (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() =>
                            updateRow(row.rowId, { impactBucketCode: b.code })
                          }
                          className={
                            'px-2 py-1 rounded text-xs border transition-colors ' +
                            (active
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-foreground border-border hover:bg-accent')
                          }
                        >
                          {b.display_label}
                        </button>
                      )
                    })}
                  </div>
                  {bucketRows.find((b) => b.code === row.impactBucketCode)?.short_description ? (
                    <p className="text-xs text-muted-foreground">
                      {
                        bucketRows.find((b) => b.code === row.impactBucketCode)
                          ?.short_description
                      }
                    </p>
                  ) : null}

                  <Textarea
                    rows={2}
                    placeholder="Optional note"
                    value={row.note}
                    onChange={(e) => updateRow(row.rowId, { note: e.target.value })}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

