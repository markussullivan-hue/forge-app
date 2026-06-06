const resetQuery = async (query) => {
  if (query && typeof query.reset === "function") {
    await query.reset();
  }
};

if (runGovernanceReviewFlow.isFetching) {
  return {
    cleared: false,
    reason: "Review is currently running."
  };
}

await currentGovernanceReviewId.setValue(null);

await resetQuery(runGovernanceReviewFlow);
await resetQuery(runGovernanceReviewQuery);
await resetQuery(getGovernanceReviewResult);

return {
  cleared: true,
  cleared_at: new Date().toISOString()
};