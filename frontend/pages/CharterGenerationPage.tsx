// CharterGenerationPage — artefact viewer + Re-Generate + PDF preview/download.
// Mirrors /context/linked-classic-app/src/CharterGenerationPage.rsx and
// /context/linked-classic-app/src/aiPortfolioDashboard.rsx.

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppState } from '../utils/appState'
import { useRunStagedGenerationPipeline } from '../hooks/backend/wizard'
import ProjectSelectorBar, { type ProjectOption } from './charter/ProjectSelectorBar'
import ProjectArrivalSummary from './charter/ProjectArrivalSummary'
import ArtefactTabs from './charter/ArtefactTabs'
import LatestRunDrawer from './charter/LatestRunDrawer'
import {
  buildActiveArtefact,
  buildArtefactMap,
  buildOrderedArtefacts,
  pickLatestRunForProject,
  type ArtefactRow,
  type GenerationRunRow,
} from './charter/derivations'
import type { PdfRow } from './charter/renderers/PdfViewer'
import { useCharterQueries, useRefreshCharter } from './charter/useRefreshCharter'

export default function CharterGenerationPage() {
  const navigate = useNavigate()
  const { currentOrgId, currentUserId, selectedProjectId, selectedArtefactCode, setAppState } = useAppState()
  const queries = useCharterQueries()
  const { projects, artefacts, activePdf, runs } = queries
  const regenerate = useRunStagedGenerationPipeline()

  const [runDrawerOpen, setRunDrawerOpen] = useState(false)

  // ---- Page refresh orchestration ----------------------------------------

  const refresh = useRefreshCharter(queries, {
    orgId: currentOrgId,
    projectId: selectedProjectId,
    selectedArtefactCode,
  })

  // Initial + org-change load: fetch the project list.
  useEffect(() => {
    if (!currentOrgId) return
    void projects.trigger({ orgId: currentOrgId }).result.catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrgId])

  // When project/org changes, refresh artefact-related queries.
  useEffect(() => {
    if (!currentOrgId || !selectedProjectId) return
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrgId, selectedProjectId])

  // When the user switches tabs, re-trigger getActiveProjectPdf with the new artefact code.
  useEffect(() => {
    if (!currentOrgId || !selectedProjectId) return
    void activePdf
      .trigger({ orgId: currentOrgId, projectId: selectedProjectId, artefactCode: selectedArtefactCode ?? null })
      .result.catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArtefactCode])

  // ---- Derived data ------------------------------------------------------

  const projectOptions = (projects.data as ProjectOption[] | null) ?? []
  const artefactRows = (artefacts.data as ArtefactRow[] | null) ?? []
  const runRows = (runs.data as GenerationRunRow[] | null) ?? []
  const pdfRows = (activePdf.data as PdfRow[] | null) ?? []

  const artefactMap = useMemo(() => buildArtefactMap(artefactRows), [artefactRows])
  const orderedArtefacts = useMemo(() => buildOrderedArtefacts(artefactMap), [artefactMap])
  const latestRun = useMemo(
    () => pickLatestRunForProject(runRows, selectedProjectId),
    [runRows, selectedProjectId],
  )

  const activeArtefact = useMemo(
    () => buildActiveArtefact(orderedArtefacts, selectedArtefactCode),
    [orderedArtefacts, selectedArtefactCode],
  )

  // Mirror the "active" tab back into app state so other queries stay in sync.
  useEffect(() => {
    if (activeArtefact.pattern === 'empty') return
    if (selectedArtefactCode !== activeArtefact.artefact_code) {
      setAppState({ selectedArtefactCode: activeArtefact.artefact_code })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeArtefact.artefact_code])

  const fallbackMarkdown = useMemo(() => {
    if (activeArtefact.pattern === 'empty' || activeArtefact.pattern === 'pdf_viewer') return null
    const row = artefactMap[activeArtefact.artefact_code]
    return row?.content_markdown ?? null
  }, [activeArtefact, artefactMap])

  // ---- Handlers ----------------------------------------------------------

  const handleNewProject = () => navigate('/wizard')

  const handleProjectChange = (projectId: string) => {
    if (!projectId || projectId === selectedProjectId) return
    setAppState({ selectedProjectId: projectId, selectedArtefactCode: null })
  }

  const handleSelectArtefact = (code: string) => {
    if (code === selectedArtefactCode) return
    setAppState({ selectedArtefactCode: code })
  }

  const handleRegenerate = async () => {
    if (!currentOrgId || !selectedProjectId) return
    try {
      await regenerate
        .trigger({
          orgId: currentOrgId,
          projectId: selectedProjectId,
          initiatedByUserId: currentUserId,
        })
        .result
      await refresh({ skipCache: true })
      toast.success('Artefacts regenerated', {
        description: 'The selected project has been regenerated and the page has been refreshed.',
      })
    } catch (err) {
      toast.error('Regeneration failed', {
        description: String(
          (err as Error)?.message || err || 'The regeneration run failed. Check the latest run status.',
        ),
      })
    }
  }

  // ---- Render ------------------------------------------------------------

  return (
    <div className="p-6 space-y-4">
      <ProjectSelectorBar
        projects={projectOptions}
        selectedProjectId={selectedProjectId}
        onProjectChange={handleProjectChange}
        onNewProject={handleNewProject}
        onRegenerate={handleRegenerate}
        regenerating={regenerate.loading}
        canRegenerate={!!currentOrgId && !!selectedProjectId}
      />

      <ProjectArrivalSummary
        selectedProjectId={selectedProjectId}
        projects={projectOptions}
        latestRun={latestRun}
        artefactMap={artefactMap}
        onViewRunDetails={() => setRunDrawerOpen(true)}
      />

      <p className="text-sm text-muted-foreground text-center">
        The tabs below will provide you with summary information. For the full documents, please use the Preview button
        and/or Download.
      </p>

      {!selectedProjectId ? (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-sm italic text-muted-foreground">
          Select a project to render artefacts.
        </div>
      ) : (
        <ArtefactTabs
          orderedArtefacts={orderedArtefacts}
          selectedArtefactCode={selectedArtefactCode}
          onSelectArtefact={handleSelectArtefact}
          activeArtefact={activeArtefact}
          pdf={pdfRows[0] ?? null}
          fallbackMarkdown={fallbackMarkdown}
        />
      )}

      <p className="text-xs text-center text-muted-foreground pt-4">
        Please keep in mind that FORGE Logic&trade; AI is not perfect. We recommend reviewing the output to ensure it
        meets your needs.
      </p>

      <LatestRunDrawer open={runDrawerOpen} onOpenChange={setRunDrawerOpen} run={latestRun} />
    </div>
  )
}
