const clearSelect = async (component) => {
  if (component && typeof component.clearValue === "function") {
    await component.clearValue();
    return;
  }

  if (component && typeof component.setValue === "function") {
    await component.setValue("");
  }
};

const resetQuery = async (query) => {
  if (query && typeof query.reset === "function") {
    await query.reset();
  }
};

await clearSelect(materialTypeSelect);
await clearSelect(aiRelevanceSelect);
await clearSelect(methodologyLensSelect);

await governanceTextInput.setValue("");
await currentGovernanceReviewId.setValue(null);

await resetQuery(runGovernanceReviewFlow);
await resetQuery(runGovernanceReviewQuery);
await resetQuery(getGovernanceReviewResult);

return {
  cleared: true,
  cleared_at: new Date().toISOString()
};