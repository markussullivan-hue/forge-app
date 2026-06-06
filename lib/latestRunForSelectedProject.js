const runs = formatDataAsArray(getGenerationRunsQuery.data || []);
const selectedProjectId = selectedProjectIdState.value;

if (!selectedProjectId) {
  return null;
}

const relevantRuns = runs
  .filter(
    r =>
      String(r.entity_type || '') === 'Project' &&
      String(r.entity_id || '') === String(selectedProjectId)
  )
  .sort(
    (a, b) =>
      new Date(b.created_at || b.started_at || 0) -
      new Date(a.created_at || a.started_at || 0)
  );

return relevantRuns[0] || null;