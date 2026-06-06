// Step 3 — Business Case Detail.
// Mirrors classic /context/linked-classic-app/src/steppedContainerHomepage.rsx
// viewKey '5' (Business Case Detail) along with container10.rsx and
// container11.rsx. Lets the user edit the inputs that previously could only be
// populated via prefill presets but are still posted to createProjectContext.

import { useEffect, useMemo } from 'react'
import { Label } from '../../lib/shadcn/label'
import { Textarea } from '../../lib/shadcn/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../lib/shadcn/select'
import {
  useGetBudgetConfidenceOptions,
  useGetKeyRoleOptions,
  useGetResourceModelOptions,
  useGetStakeholderGroupOptions,
} from '../../hooks/backend/wizard/lookups'
import { MultiSelect } from './MultiSelect'
import { useWizardState } from './wizardState'

type Option = { value: string; label: string }

export default function Step3BusinessCaseDetail() {
  const ws = useWizardState()

  const resourceModels = useGetResourceModelOptions()
  const keyRoles = useGetKeyRoleOptions()
  const stakeholderGroups = useGetStakeholderGroupOptions()
  const budgetConfidence = useGetBudgetConfidenceOptions()

  useEffect(() => {
    resourceModels.trigger()
    keyRoles.trigger()
    stakeholderGroups.trigger()
    budgetConfidence.trigger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resourceModelOptions = useMemo<Option[]>(
    () => (resourceModels.data ?? []) as Option[],
    [resourceModels.data],
  )

  const keyRoleOptions = useMemo<Option[]>(
    () => (keyRoles.data ?? []) as Option[],
    [keyRoles.data],
  )

  const stakeholderOptions = useMemo<Option[]>(
    () => (stakeholderGroups.data ?? []) as Option[],
    [stakeholderGroups.data],
  )

  const budgetConfidenceOptions = useMemo<Option[]>(
    () => (budgetConfidence.data ?? []) as Option[],
    [budgetConfidence.data],
  )

  return (
    <div className="space-y-6">
      {/* Scope Boundaries */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Scope Boundaries</h3>
          <p className="text-xs text-muted-foreground">
            Purpose: clarify what the business case should not assume.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="explicitOutOfScopeInput">Explicit out of scope</Label>
            <Textarea
              id="explicitOutOfScopeInput"
              rows={3}
              placeholder="List anything deliberately excluded from this initiative."
              value={ws.explicitOutOfScopeInput}
              onChange={(e) =>
                ws.setWizardState({ explicitOutOfScopeInput: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="knownDependenciesInput">Known dependencies</Label>
            <Textarea
              id="knownDependenciesInput"
              rows={3}
              placeholder="List teams, decisions, systems, suppliers, approvals or activities this work depends on."
              value={ws.knownDependenciesInput}
              onChange={(e) =>
                ws.setWizardState({ knownDependenciesInput: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* Planning Assumptions & Constraints */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Planning Assumptions &amp; Constraints</h3>
          <p className="text-xs text-muted-foreground">
            Purpose: improve assumptions, constraints, risk conversion and early
            warning indicators.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="keyAssumptionsInput">Key assumptions</Label>
            <Textarea
              id="keyAssumptionsInput"
              rows={3}
              placeholder="List planning assumptions the business case should rely on, but which still need validation."
              value={ws.keyAssumptionsInput}
              onChange={(e) =>
                ws.setWizardState({ keyAssumptionsInput: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="keyConstraintsInput">Key constraints</Label>
            <Textarea
              id="keyConstraintsInput"
              rows={3}
              placeholder="List known limits, deadlines, policies, capacity issues, technology constraints or governance constraints."
              value={ws.keyConstraintsInput}
              onChange={(e) =>
                ws.setWizardState({ keyConstraintsInput: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* Delivery & Resource Shape */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Delivery &amp; Resource Shape</h3>
          <p className="text-xs text-muted-foreground">
            Purpose: improve role matrix, effort assumptions and capability needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Resource model</Label>
            <Select
              {...(ws.resourceModelSelect ? { value: ws.resourceModelSelect } : {})}
              onValueChange={(v) => ws.setWizardState({ resourceModelSelect: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {resourceModelOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Key roles required</Label>
            <MultiSelect<string>
              options={keyRoleOptions}
              value={ws.keyRolesRequiredMultiselect}
              onChange={(next) =>
                ws.setWizardState({ keyRolesRequiredMultiselect: next })
              }
              placeholder="Select options"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Stakeholder groups</Label>
            <MultiSelect<string>
              options={stakeholderOptions}
              value={ws.stakeholderGroupsMultiselect}
              onChange={(next) =>
                ws.setWizardState({ stakeholderGroupsMultiselect: next })
              }
              placeholder="Select stakeholder groups"
            />
          </div>
        </div>
      </section>

      {/* Financial, Quality & Assurance Inputs */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">
            Financial, Quality &amp; Assurance Inputs
          </h3>
          <p className="text-xs text-muted-foreground">
            Purpose: strengthen funding assumptions, cost drivers and quality plan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Budget confidence</Label>
            <Select
              {...(ws.budgetConfidenceSelect
                ? { value: ws.budgetConfidenceSelect }
                : {})}
              onValueChange={(v) =>
                ws.setWizardState({ budgetConfidenceSelect: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget confidence" />
              </SelectTrigger>
              <SelectContent>
                {budgetConfidenceOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budgetNotesInput">Budget notes</Label>
            <Textarea
              id="budgetNotesInput"
              rows={3}
              placeholder="Enter any issues or constraints."
              value={ws.budgetNotesInput}
              onChange={(e) =>
                ws.setWizardState({ budgetNotesInput: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="qualityAssuranceExpectationsInput">
              Quality / assurance expectations
            </Label>
            <Textarea
              id="qualityAssuranceExpectationsInput"
              rows={3}
              placeholder="List required reviews, assurance gates, testing expectations, compliance checks or sign-offs."
              value={ws.qualityAssuranceExpectationsInput}
              onChange={(e) =>
                ws.setWizardState({
                  qualityAssuranceExpectationsInput: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        All fields on this step are optional — they refine the business case but do
        not block generation.
      </p>
    </div>
  )
}
