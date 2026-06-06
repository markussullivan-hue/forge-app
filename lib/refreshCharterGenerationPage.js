// Documentation:
//   Sole orchestrator on page load for CharterGenerationPage.
//   Reads org_id from getCurrentOrgId's trigger() return value to avoid
//   Retool's await-vs-event-handler timing race (where query.data is not
//   reliably populated immediately after `await query.trigger()` resolves).
//   Same pattern for getProjectsForSelector. Validates the persisted
//   selectedProjectIdState exists in the option set; clears it if not
//   (handles deleted projects and org switches without throwing in
//   projectSelect.setValue).
// Returns:
//   {
//     ok: boolean,
//     reason?: string,
//     currentOrgId?: string | null,
//     selectedProjectId?: string | null
//   }

// 1. Resolve organisation. Use trigger() return value, not query.data.
let orgId = currentOrgIdState.value || null;

if (!orgId) {
  const orgResult = await getCurrentOrgId.trigger();
  orgId = orgResult?.org_id?.[0] ?? null;
  await currentOrgIdState.setValue(orgId);
}

if (!orgId) {
  utils.showNotification({
    title: 'No organisation found',
    description: 'Your user is not assigned to an active organisation.',
    notificationType: 'error',
  });
  return {
    ok: false,
    reason: 'No organisation',
    currentOrgId: null,
    selectedProjectId: selectedProjectIdState.value || null,
  };
}

// 2. Fetch project selector options for the resolved org.
const projectsResult = await getProjectsForSelector.trigger();
const options = formatDataAsArray(projectsResult || {});

// 3. Validate the persisted selected project still exists in the option set.
const selectedId = selectedProjectIdState.value;

if (!selectedId) {
  return {
    ok: false,
    reason: 'No selected project',
    currentOrgId: orgId,
    selectedProjectId: null,
  };
}

const selectedStillValid = options.some(
  (r) => String(r?.project_id || '') === String(selectedId)
);

if (!selectedStillValid) {
  await selectedProjectIdState.setValue(null);
  return {
    ok: false,
    reason: 'Selected project no longer available',
    currentOrgId: orgId,
    selectedProjectId: null,
  };
}

// 4. Sync the visible selector to the canonical state value.
await projectSelect.setValue(selectedId);

// 5. Refresh downstream queries for the selected project.
await getCurrentArtefactsForEntity.trigger();
await artefactMap.trigger();
await orderedArtefacts.trigger();
await activeArtefact.trigger();
await getActiveProjectPdf.trigger();
// Legacy/peripheral — kept for backward compatibility with other components.
await getGenerationRunsQuery.trigger();
await latestRunForSelectedProject.trigger();
await viewerStatesByType.trigger();

return {
  ok: true,
  currentOrgId: orgId,
  selectedProjectId: selectedId,
};