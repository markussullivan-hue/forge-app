// Ports /context/linked-classic-app/lib/prepareGovernanceReviewRun.js to a
// serverless function. In the classic app, this is a JS query that simply mints
// a UUID + ISO timestamp; the DB row is created by the downstream workflow when
// it processes the webhook payload.
//
// MUTATIVE: classified mutative because callers treat it as the "start a new
// review" boundary — same review_id is propagated to the workflow webhook and
// later read back from governance_review_runs.

type Params = Record<string, never>

type Result = {
  review_id: string
  prepared_at: string
}

function mintUuid(): string {
  // Prefer the runtime crypto.randomUUID when available.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default async function prepareGovernanceReviewRun(
  _req: { params: Params; user: User },
): Promise<Result> {
  return {
    review_id: mintUuid(),
    prepared_at: new Date().toISOString(),
  }
}
