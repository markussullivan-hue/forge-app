// Ports the classic WorkflowRun "runGovernanceReviewQuery" to a serverless
// call against the retoolworkflowwebhook REST resource.
//
// Body shape comes from
// /context/linked-classic-app/lib/runGovernanceReviewQuery.json.
//
// NOTE: The connected webhook URL currently targets a different workflow
// (f30220c3-c5f8-40db-b993-5a79f7f32ce5) than the classic governance review
// workflow (a2edbd42-3ebe-48c9-a1e7-46f6101b7d21). The function still posts
// the canonical body shape so the resource can be repointed without code
// changes.
//
// MUTATIVE: kicks off the remote governance review workflow.

type Params = {
  reviewId: string
  materialType: string | null
  aiRelevance: string | null
  methodologyLens: string | null
  governanceText: string
}

export default async function runGovernanceReviewWorkflow(
  req: { params: Params; user: User },
): Promise<unknown> {
  const body = {
    review_id: req.params.reviewId,
    material_type: req.params.materialType ?? '',
    ai_relevance: req.params.aiRelevance ?? '',
    methodology_lens: req.params.methodologyLens ?? '',
    governance_text: req.params.governanceText ?? '',
  }

  const response = await retoolworkflowwebhook.rawRequest<unknown>({
    path: '',
    method: 'POST',
    body,
  })

  return response.data ?? null
}
