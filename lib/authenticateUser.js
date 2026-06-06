// authenticateUser
// Validates inputs, verifies credentials, writes session, returns user.
// checkCredentials.trigger() returns COLUMN-oriented data: { id:[...], email:[...], is_active:[...] }

const email = String(emailInput.value || '').trim();
const password = String(passwordInput.value || '');

const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
if (!email) {
  throw new Error('Enter your email address.');
}
if (!emailLooksValid) {
  throw new Error('Enter a valid email address.');
}
if (!password) {
  throw new Error('Enter your password.');
}

const result = await checkCredentials.trigger();
const ids = (result && result.id) || [];

if (ids.length !== 1) {
  throw new Error('Incorrect email or password.');
}

const user = {
  id: result.id[0],
  email: result.email[0]
};

await localStorage.setValue('forge_session', {
  id: user.id,
  email: user.email,
  ts: Date.now()
});

return { ok: true, id: user.id, email: user.email };