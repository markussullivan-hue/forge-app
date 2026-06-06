import { useBackendFunction } from '../useBackendFunction'

export function useGetContinueWorkingProjects() {
  return useBackendFunction('/backend/dashboard/getContinueWorkingProjects.ts')
}
export function useGetDashboardKpis() {
  return useBackendFunction('/backend/dashboard/getDashboardKpis.ts')
}
export function useGetDecisionsNeeded() {
  return useBackendFunction('/backend/dashboard/getDecisionsNeeded.ts')
}
export function useGetRecentGenerationRuns() {
  return useBackendFunction('/backend/dashboard/getRecentGenerationRuns.ts')
}
export function useGetRisksAssuranceItems() {
  return useBackendFunction('/backend/dashboard/getRisksAssuranceItems.ts')
}
