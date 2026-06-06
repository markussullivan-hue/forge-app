// Forwards the sign-up payload to the wf_signup Retool workflow and returns
// its response body verbatim so the UI can branch on `status`
// (`ok`, `email_exists`, `org_not_found`, `org_ambiguous`, ...).
//
// Endpoint URL and X-Workflow-Api-Key live on the `wf_signup_webhook`
// resource — NOT here. To repoint at a different workflow, edit that
// resource; no code change needed.
type Params = {
  full_name: string
  email: string
  password: string
  org_name: string
}
type SignupResponseBody = {
  status?: string
  [key: string]: unknown
}
export default async function signup(
  req: { params: Params; user: User },
): Promise<SignupResponseBody> {
  const body = {
    full_name: req.params.full_name,
    email: req.params.email,
    password: req.params.password,
    org_name: req.params.org_name,
  }

  try {
    const response = await wfSignupWebhook.rawRequest<SignupResponseBody>({
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
      typeof (data as SignupResponseBody).status !== 'string'
    ) {
      return {
        status: 'error',
        message: 'Unexpected sign-up response from workflow webhook.',
      }
    }

    return data
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { status: 'error', message }
  }
}