// sessionGuard — runs on dashboardPage load.
// Throws if no valid session, which fires the failure handler to redirect.

const session = localStorage.values.forge_session;

if (!session || !session.id) {
  throw new Error('No valid session.');
}

return { ok: true };