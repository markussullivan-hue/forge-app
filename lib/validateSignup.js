const name  = signUpFullname.value.trim();
const email = signUpEmail.value.trim();
const pw    = signUpPassword.value;
const org   = signUpOrgName.value.trim();
const minLen = Number(retoolContext.configVars.SIGNUP_MIN_PW_LENGTH);

if (!name || !email || !pw || !org) {
  utils.showNotification({ title: "Missing fields", description: "Please complete all fields.", notificationType: "warning", duration: 5 });
  return;
}
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  utils.showNotification({ title: "Invalid email", description: "Please enter a valid email address.", notificationType: "warning", duration: 5 });
  return;
}
if (pw.length < minLen) {
  utils.showNotification({ title: "Password too short", description: `Password must be at least ${minLen} characters.`, notificationType: "warning", duration: 5 });
  return;
}
return callSignupWorkflow.trigger();