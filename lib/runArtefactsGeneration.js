// runArtefactsGeneration — orchestrator for the wizard's initial generation flow.
// Validates state, fires the workflow, captures run_id from the DB, then
// triggers the verifier. See handoff section 3 for the full architecture.
const orgId    = createdOrgIdState.value     || currentOrgIdState.value     || null;
const entityId = createdProjectIdState.value || selectedProjectIdState.value || null;

if (!orgId || !entityId) {
  const missing = [];
  if (!orgId)    missing.push('organisation id');
  if (!entityId) missing.push('project id');
  const msg = `Wizard state incomplete (${missing.join(', ')} missing).`;
  await generationStatus.setValue('error');
  await generationError.setValue(msg);
  utils.showNotification({ title: 'Cannot start generation', description: msg, notificationType: 'error' });
  return;
}

const startedAt = new Date(Date.now() - 5 * 1000).toISOString();
await generationStartedAt.setValue(startedAt);
await currentRunIdState.setValue(null);
await generationError.setValue(null);
await generationResult.setValue(null);
await generationStatus.setValue('running');

pollGenerationProgress.trigger();

try {
  await triggerInitialArtefactsGeneration.trigger();
  const pollResult = await pollGenerationProgress.trigger();

  const runId =
    pollResult?.run_id?.[0] ??
    pollResult?.[0]?.run_id ??
    pollGenerationProgress.data?.run_id?.[0] ??
    pollGenerationProgress.data?.[0]?.run_id ??
    null;

  if (!runId) {
    throw new Error(
      'Workflow finished but no matching generation_runs row was found ' +
      '(filtered by org_id + entity_id + created_at >= generationStartedAt). ' +
      'Check the workflow Runs panel: was a new run created?'
    );
  }

  await currentRunIdState.setValue(runId);

  if (generationStatus.value === 'running') {
    await finaliseGenerationOnComplete.trigger();
  }
} catch (err) {
  // Retool query rejections often serialise to {}. The real cause lives on
  // each sub-query's own .error field — surface those, not the raw rejection.
  let serialised = null;
  try { serialised = JSON.stringify(err); } catch (_) { serialised = null; }

  const detail =
    triggerInitialArtefactsGeneration.error ||
    pollGenerationProgress.error ||
    err?.message ||
    (typeof err === 'string' ? err : null) ||
    (serialised && serialised !== '{}' ? serialised : null) ||
    'Workflow trigger failed (no detail available).';

  console.error('[runArtefactsGeneration] caught:', {
    rejection: err,
    triggerInitialArtefactsGeneration_error: triggerInitialArtefactsGeneration.error,
    pollGenerationProgress_error: pollGenerationProgress.error,
  });

  await generationStatus.setValue('error');
  await generationError.setValue(String(detail));
  utils.showNotification({
    title: 'Generation failed',
    description: String(detail),
    notificationType: 'error',
  });
}