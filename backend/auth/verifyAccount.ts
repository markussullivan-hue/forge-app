// Forwards the verification token to the wf_verify Retool workflow and returns
// its response body verbatim so the UI can branch on `status`
// (`ok`, `invalid`, `already_used`, `expired`, ...).
//
// Endpoint URL and X-Workflow-Api-Key live on the `wf_verify_webhook`
// resource — NOT here. To repoint at a different workflow, edit that
// resource; no code change needed.
type Params = {
  token: string
}
type VerifyResponseBody = {
  status?: string
  [key: string]: unknown
}
export default async function verifyAccount(
  req: { params: Params; user: User },
): Promise<VerifyResponseBody> {
  const body = {
    token: req.params.token,
  }

  try {
    const response = await wfVerifyWebhook.rawRequest<VerifyResponseBody>({
      path: '',
      method: 'POST',
      body,
    })

    const data = response.data

    // Workflow contract: a JSON object with a string `status`. Anything else
    // (HTML error page, empty body, wrong shape) means the webhook is
    // misconfigured or the workflow errored — surface a clean error instead
    // of passing junk to the UI's status branch.
    if (
      data == null ||
      typeof data !== 'object' ||
      typeof (data as VerifyResponseBody).status !== 'string'
    ) {
      return {
        status: 'error',
        message: 'Unexpected verification response from workflow webhook.',
      }
    }

    return data
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { status: 'error', message }
  }
}