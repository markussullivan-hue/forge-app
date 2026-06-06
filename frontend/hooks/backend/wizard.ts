import { useBackendFunction } from '../useBackendFunction'

export function useCreateProject() {
  return useBackendFunction('/backend/wizard/createProject.ts')
}
export function useCreateProjectContext() {
  return useBackendFunction('/backend/wizard/createProjectContext.ts')
}
export function useCreateProjectSystems() {
  return useBackendFunction('/backend/wizard/createProjectSystems.ts')
}
export function usePollGenerationProgress() {
  return useBackendFunction('/backend/wizard/pollGenerationProgress.ts')
}
export function useRunStagedGenerationPipeline() {
  return useBackendFunction('/backend/wizard/runStagedGenerationPipeline.ts')
}
