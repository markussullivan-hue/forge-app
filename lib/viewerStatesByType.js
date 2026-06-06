// Documentation:
//   Computes a per-artefact viewer state ({ state, message, latestRun }) for the selected project.
//   Used by the CharterGenerationPage artefact viewer to show clear empty/loading/generating/failed messaging.
// Returns:
//   {
//     [type: string]: {
//       state: 'not_selected' | 'loading' | 'complete' | 'generating' | 'failed' | 'missing',
//       message: string,
//       latestRun: any
//     }
//   }

const runs = formatDataAsArray(getGenerationRunsQuery.data || []);
const artefacts = artefactMap.data || {};
const selectedEntityId = selectedProjectIdState.value;
const selectedEntityType = 'Project';

const relevantRuns = runs.
filter(
(r) =>
String(r.entity_type || '') === selectedEntityType &&
String(r.entity_id || '') === String(selectedEntityId || '')).

sort((a, b) => {
  const bTime = new Date(b.created_at || b.started_at || 0).getTime();
  const aTime = new Date(a.created_at || a.started_at || 0).getTime();
  return bTime - aTime;
});

const latestRun = relevantRuns[0] || null;
const latestStatus = String(latestRun?.status || '').toLowerCase();

// NOTE: Do not include refreshCharterGenerationPage.isFetching here.
// viewerStatesByType is often triggered from within refreshCharterGenerationPage, so including
// the parent query's isFetching flag can cause viewerStatesByType to return "loading" and never
// get recomputed to "complete".
const pageLoading =
getCurrentArtefactsForEntity.isFetching ||
artefactMap.isFetching ||
getGenerationRunsQuery.isFetching;

const manualGenerating =
typeof runStagedGenerationPipeline !== 'undefined' &&
runStagedGenerationPipeline.isFetching;

const runningStatuses = ['running', 'pending', 'queued', 'in_progress'];

const types = [
'context',
'charter',
'plan',
'resources',
'risks',
'financials',
'pdf'];


return Object.fromEntries(
types.map((type) => {
  const artefact = artefacts[type] || null;

  let state = 'complete';
  let message = '';

  if (!selectedEntityId) {
    state = 'not_selected';
    message = 'Select a project to view generated artefacts.';
  } else if (pageLoading) {
    state = 'loading';
    message = 'Loading latest artefacts...';
  } else if (artefact) {
    state = 'complete';
    message = '';
  } else if (manualGenerating || runningStatuses.includes(latestStatus)) {
    state = 'generating';
    message = 'Generation in progress. Artefacts will appear shortly.';
  } else if (latestStatus === 'failed' || latestStatus === 'error') {
    state = 'failed';
    message = 'Latest generation failed. Check the run status, then regenerate if needed.';
  } else {
    state = 'missing';

    if (type === 'pdf') {
      message = 'No current PDF is available for this project.';
    } else {
      message = `No current ${type} artefact is available for this project.`;
    }
  }

  return [type, { state, message, latestRun }];
}));