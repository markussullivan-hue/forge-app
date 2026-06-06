// Step 1 — Initiative Overview.
// Mirrors classic /context/linked-classic-app/src/containerInitiativeOverview.rsx.
// Captures only the basics: name, purpose, budget, dates, service industry.

import { useEffect, useMemo } from 'react'
import { Input } from '../../lib/shadcn/input'
import { Label } from '../../lib/shadcn/label'
import { Textarea } from '../../lib/shadcn/textarea'
import { useGetCreateServiceIndustryType } from '../../hooks/backend/wizard/lookups'
import { useWizardState } from './wizardState'
import { MultiSelect } from './MultiSelect'
import { FieldGuidance } from './FieldGuidance'

type LookupRowWithLabel = { id?: number; label: string; value?: string }

function toMs(date: string): number {
  if (!date) return Number.NaN
  return new Date(date).setHours(0, 0, 0, 0)
}

function getDateError(start: string, end: string): string {
  if (!start || !end) return ''
  const startMs = toMs(start)
  const endMs = toMs(end)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return ''
  const minEnd = new Date(startMs)
  minEnd.setMonth(minEnd.getMonth() + 1)
  return endMs < minEnd.getTime()
    ? 'Target end date must be at least 1 month after the start date.'
    : ''
}

export default function Step1Overview() {
  const ws = useWizardState()
  const industries = useGetCreateServiceIndustryType()

  useEffect(() => {
    industries.trigger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const industryOptions = useMemo(
    () =>
      ((industries.data ?? []) as LookupRowWithLabel[]).map((r) => ({
        value: Number(r.id),
        label: r.label,
      })),
    [industries.data],
  )

  const dateError = getDateError(
    ws.initiativeTargetStartDate,
    ws.initiativeTargetEndDate,
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Initiative Overview</h3>
        <p className="text-sm text-muted-foreground">
          Capture the basics so we can tailor the charter and artefact generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="initiativeName">
            Initiative Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="initiativeName"
            placeholder="e.g. Claims Platform Upgrade"
            value={ws.initiativeName}
            onChange={(e) => ws.setWizardState({ initiativeName: e.target.value })}
          />
          <FieldGuidance id="initiativeName" />
        </div>

        {/* Purpose */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="initiativeDescription">
            Initiative Purpose <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="initiativeDescription"
            placeholder="A short summary of what this initiative will deliver"
            value={ws.initiativeDescription}
            onChange={(e) =>
              ws.setWizardState({ initiativeDescription: e.target.value })
            }
            rows={3}
          />
          <FieldGuidance id="initiativeDescription" />
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <Label htmlFor="initiativeBudget">
            Estimated Budget (£) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="initiativeBudget"
            type="number"
            inputMode="decimal"
            min={0}
            step={1000}
            placeholder="Enter value"
            value={ws.initiativeBudget ?? ''}
            onChange={(e) => {
              const v = e.target.value
              ws.setWizardState({ initiativeBudget: v === '' ? null : Number(v) })
            }}
          />
          <FieldGuidance id="initiativeBudget" />
        </div>

        {/* Service industry */}
        <div className="space-y-1.5">
          <Label>
            Service Industry <span className="text-destructive">*</span>
          </Label>
          <MultiSelect<number>
            options={industryOptions}
            value={ws.initiativeServiceIndustrySelect}
            onChange={(next) =>
              ws.setWizardState({ initiativeServiceIndustrySelect: next })
            }
            placeholder="Select options"
          />
        </div>

        {/* Start date */}
        <div className="space-y-1.5">
          <Label htmlFor="initiativeTargetStartDate">
            Target Start Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="initiativeTargetStartDate"
            type="date"
            value={ws.initiativeTargetStartDate}
            onChange={(e) =>
              ws.setWizardState({ initiativeTargetStartDate: e.target.value })
            }
          />
          <FieldGuidance id="initiativeTargetStartDate" />
        </div>

        {/* End date */}
        <div className="space-y-1.5">
          <Label htmlFor="initiativeTargetEndDate">
            Target End Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="initiativeTargetEndDate"
            type="date"
            value={ws.initiativeTargetEndDate}
            onChange={(e) =>
              ws.setWizardState({ initiativeTargetEndDate: e.target.value })
            }
          />
          {dateError ? (
            <p className="text-xs text-destructive">{dateError}</p>
          ) : null}
          <FieldGuidance id="initiativeTargetEndDate" />
        </div>
      </div>
    </div>
  )
}
