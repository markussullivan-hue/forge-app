import { useEffect, useState } from 'react'

export type AppState = {
  currentOrgId: string | null
  currentUserId: string | null
  selectedProjectId: string | null
  createdProjectId: string | null
  createdOrgId: string | null
  selectedArtefactCode: string | null
}

const INITIAL_STATE: AppState = {
  currentOrgId: null,
  currentUserId: null,
  selectedProjectId: null,
  createdProjectId: null,
  createdOrgId: null,
  selectedArtefactCode: null,
}

type Listener = (state: AppState) => void

let state: AppState = { ...INITIAL_STATE }
const listeners = new Set<Listener>()

function notify(): void {
  for (const listener of listeners) listener(state)
}

export function getAppState(): AppState {
  return state
}

export function setAppState(patch: Partial<AppState>): void {
  state = { ...state, ...patch }
  notify()
}

export function resetAppState(): void {
  state = { ...INITIAL_STATE }
  notify()
}

export function subscribeAppState(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Hook for reading + writing the global app state. */
export function useAppState(): AppState & {
  setAppState: (patch: Partial<AppState>) => void
  resetAppState: () => void
} {
  const [snapshot, setSnapshot] = useState<AppState>(state)

  useEffect(() => {
    return subscribeAppState(setSnapshot)
  }, [])

  return { ...snapshot, setAppState, resetAppState }
}
