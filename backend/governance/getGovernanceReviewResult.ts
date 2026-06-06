// Ports /context/linked-classic-app/lib/getGovernanceReviewResult.sql to a
// serverless function. Read-only — just selects the stored review row.

type Params = {
  reviewId: string | null
}

export type GovernanceReviewRow = {
  review_id: string
  status: string | null
  material_type: string | null
  material_type_label: string | null
  ai_relevance: string | null
  ai_relevance_label: string | null
  methodology_lens: string | null
  methodology_lens_label: string | null
  character_count: number | null
  word_count: number | null
  result_json: unknown
  diagnostics_json: unknown
  error_message: string | null
  created_at: string | null
  completed_at: string | null
  expires_at: string | null
}

const SQL = `
select
  review_id,
  status,
  material_type,
  material_type_label,
  ai_relevance,
  ai_relevance_label,
  methodology_lens,
  methodology_lens_label,
  character_count,
  word_count,
  result_json,
  diagnostics_json,
  error_message,
  created_at,
  completed_at,
  expires_at
from governance_review_runs
where review_id = nullif($1, '')::uuid
limit 1;
`

export default async function getGovernanceReviewResult(
  req: { params: Params; user: User },
): Promise<GovernanceReviewRow | null> {
  const reviewId = req.params.reviewId ?? ''
  if (!reviewId) return null

  const result = await forgeSupabaseShadow2.query<GovernanceReviewRow>(SQL, [reviewId])
  return result.data[0] ?? null
}
