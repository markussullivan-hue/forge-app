import { useBackendFunction } from '../useBackendFunction'

export function useCheckCredentials() {
  return useBackendFunction('/backend/auth/checkCredentials.ts')
}
export function useCheckCredentialsFresh() {
  return useBackendFunction('/backend/auth/checkCredentialsFresh.ts')
}
export function useGetCurrentOrgId() {
  return useBackendFunction('/backend/auth/getCurrentOrgId.ts')
}
export function useGetCurrentUserId() {
  return useBackendFunction('/backend/auth/getCurrentUserId.ts')
}
export function usePingForgeDb() {
  return useBackendFunction('/backend/auth/pingForgeDb.ts')
}
export function useSeedAdminUser() {
  return useBackendFunction('/backend/auth/seedAdminUser.ts')
}
export function useSignup() {
  return useBackendFunction('/backend/auth/signup.ts')
}
export function useVerifyAccount() {
  return useBackendFunction('/backend/auth/verifyAccount.ts')
}
