import { useBackendFunction } from '../useBackendFunction'

export function useGetActiveProjectPdf() {
  return useBackendFunction('/backend/charter/getActiveProjectPdf.ts')
}
export function useGetCurrentArtefactsForEntity() {
  return useBackendFunction('/backend/charter/getCurrentArtefactsForEntity.ts')
}
export function useGetCurrentObservationsForEntity() {
  return useBackendFunction('/backend/charter/getCurrentObservationsForEntity.ts')
}
export function useGetGenerationRunsQuery() {
  return useBackendFunction('/backend/charter/getGenerationRunsQuery.ts')
}
export function useGetLatestPdfForEntity() {
  return useBackendFunction('/backend/charter/getLatestPdfForEntity.ts')
}
export function useGetProjectsForSelector() {
  return useBackendFunction('/backend/charter/getProjectsForSelector.ts')
}
