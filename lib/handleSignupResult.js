// Resolve the wf_signup response body regardless of HTTP status or where Retool placed it.
let body = callSignupWorkflow.data;

if (!body || typeof body.status === "undefined") {
  const err = callSignupWorkflow.error;
  if (err) {
    try {
      const raw = typeof err === "string"
        ? err
        : (err.message || err.body || JSON.stringify(err));
      const match = typeof raw === "string" ? raw.match(/\{[\s\S]*\}/) : null;
      body = match ? JSON.parse(match[0]) : (typeof err === "object" ? err : null);
    } catch (e) {
      body = null;
    }
  }
}

const status = body && body.status ? body.status : null;

switch (status) {
case "ok":
    utils.showNotification({ title: "Account created", description: "Check your email to verify your account.", notificationType: "success", duration: 6 });
    signUpFullname.clearValue();
    signUpEmail.clearValue();
    signUpPassword.clearValue();
    signUpOrgName.clearValue();
    break;
  case "email_exists":
    utils.showNotification({ title: "Email already registered", description: "An account with this email already exists. Try logging in instead.", notificationType: "warning", duration: 6 });
    break;
  case "org_not_found":
    utils.showNotification({ title: "Organisation not found", description: "We couldn't find that organisation. Check the name and try again.", notificationType: "warning", duration: 6 });
    break;
  case "org_ambiguous":
    utils.showNotification({ title: "Organisation name not unique", description: "That name matches more than one organisation. Please contact your administrator.", notificationType: "warning", duration: 6 });
    break;
  default:
    utils.showNotification({ title: "Sign-up failed", description: "Something went wrong. Please try again.", notificationType: "error", duration: 6 });
    break;
}