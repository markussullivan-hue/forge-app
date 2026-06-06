import { useBackendFunction } from '../useBackendFunction'

export function useGetGovernanceReviewResult() {
  return useBackendFunction('/backend/governance/getGovernanceReviewResult.ts')
}
export function usePrepareGovernanceReviewRun() {
  return useBackendFunction('/backend/governance/prepareGovernanceReviewRun.ts')
}
export function useRunGovernanceReviewWorkflow() {
  return useBackendFunction('/backend/governance/runGovernanceReviewWorkflow.ts')
}
