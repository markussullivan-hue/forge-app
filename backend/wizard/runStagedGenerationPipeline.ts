// Ports /context/linked-classic-app/lib/runStagedGenerationPipeline.json (the
// WorkflowRun) to a serverless function call against the retoolworkflowwebhook
// REST resource.
//
// NOTE: The connected webhook URL targets a different workflow ID
// (f30220c3-c5f8-40db-b993-5a79f7f32ce5) than the classic staged-generation
// workflow (b5ecc0c6-1732-4bc9-a7a9-0e0425e38e5f). The function still posts
// the canonical body shape so the resource can be repointed without code
// changes.
//
// MUTATIVE: kicks off remote artefact generation.

type Params = {
  orgId: string
  projectId: string
  initiatedByUserId: string | null
}

export default async function runStagedGenerationPipeline(
  req: { params: Params; user: User },
): Promise<unknown> {
  const body = {
    org_id: req.params.orgId,
    entity_type: 'Project' as const,
    entity_id: req.params.projectId,
    initiated_by_user_id: req.params.initiatedByUserId ?? null,
    initiated_by_email: req.user?.email ?? null,
  }

  const response = await wfArtefactPackWebhook.rawRequest<unknown>({
    path: '',
    method: 'POST',
    body,
  })

  return response.data ?? null
}
