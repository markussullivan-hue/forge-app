// Mirrors /context/linked-classic-app/src/confirmGenerationModal.rsx.
// One Dialog whose body switches between confirm / running / error / complete
// states, driven by wizardState.generationStatus.

import { Sparkles } from 'lucide-react'
import { Button } from '../../lib/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../lib/shadcn/dialog'
import { Progress } from '../../lib/shadcn/progress'
import GenerationErrorPanel from './GenerationErrorPanel'
import type { GenerationStatus } from './wizardState'

type ProgressInfo = {
  stagesDone: number
  totalStages: number
  currentStage: string | null
}

type Props = {
  status: GenerationStatus
  initiativeName: string
  errorMessage: string | null
  progress: ProgressInfo
  previewPdfUrl?: string | null
  downloadPdfUrl?: string | null
  onCancel: () => void
  onConfirm: () => void
  onRetry: () => void
  onClose: () => void
}

export default function ConfirmGenerationModal(props: Props) {
  const {
    status,
    initiativeName,
    errorMessage,
    progress,
    previewPdfUrl,
    downloadPdfUrl,
    onCancel,
    onConfirm,
    onRetry,
    onClose,
  } = props

  const hasPreview = typeof previewPdfUrl === 'string' && previewPdfUrl.length > 0
  const hasDownload = typeof downloadPdfUrl === 'string' && downloadPdfUrl.length > 0

  // The dialog is open whenever the flow is past `idle`.
  const open = status !== 'idle'
  const isRunning = status === 'running'
  const isError = status === 'error'
  const isComplete = status === 'complete'
  const isConfirming = status === 'confirming'

  const pct =
    progress.totalStages > 0
      ? Math.min(100, Math.round((progress.stagesDone / progress.totalStages) * 100))
      : 0

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Closing via the X icon or pressing escape acts as Cancel/Close.
        if (!next) {
          if (isRunning) return // disallow close while running
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Generate governance pack</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isConfirming ? (
            <p className="text-center text-sm">
              <strong>
                Ready to generate the governance pack for{' '}
                {initiativeName || 'this initiative'}.
              </strong>
              <br />
              This will take around 90 seconds. You&apos;ll see live progress here.
            </p>
          ) : null}

          {isRunning ? (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium">
                Generating governance pack…
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Stage {progress.stagesDone} of {progress.totalStages}:{' '}
                <strong>{progress.currentStage || 'starting'}</strong>
              </p>
              <Progress value={pct} />
            </div>
          ) : null}

          {isError ? (
            <GenerationErrorPanel
              errorMessage={errorMessage}
              onClose={onClose}
              onRetry={onRetry}
            />
          ) : null}

          {isComplete ? (
            <div className="space-y-3 text-center">
              <p className="text-sm font-medium">
                ✓ Pack generated. {initiativeName || 'Your governance pack'} is ready.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {hasPreview ? (
                  <Button type="button" variant="outline" asChild>
                    <a
                      href={previewPdfUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview PDF
                    </a>
                  </Button>
                ) : null}
                {hasDownload ? (
                  <Button type="button" variant="outline" asChild>
                    <a
                      href={downloadPdfUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download PDF
                    </a>
                  </Button>
                ) : null}
                <Button type="button" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {isConfirming ? (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={!initiativeName}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Generate
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
