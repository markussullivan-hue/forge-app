// runGenerateFlow — wizard "Create" handler.
// Creates the project and its context, sets state, then opens the
// confirmation modal. Does NOT trigger the artefact-generation workflow —
// that's handled by runArtefactsGeneration after the user confirms.
const createProjectResult = await createProject.trigger();

const projectId =
  createProjectResult?.project_id?.[0] ??
  createProjectResult?.[0]?.project_id ??
  createProject.data?.project_id?.[0] ??
  createProject.data?.[0]?.project_id;
const orgId =
  createProjectResult?.org_id?.[0] ??
  createProjectResult?.[0]?.org_id ??
  createProject.data?.org_id?.[0] ??
  createProject.data?.[0]?.org_id;

if (!projectId || !orgId) {
  throw new Error(
    `createProject returned no ids. Result: ${JSON.stringify(createProjectResult)}`
  );
}

await createdProjectIdState.setValue(projectId);
await selectedProjectIdState.setValue(projectId);
await createdOrgIdState.setValue(orgId);

const createProjectContextResult = await createProjectContext.trigger();

const contextProjectId =
  createProjectContextResult?.project_id?.[0] ??
  createProjectContextResult?.[0]?.project_id ??
  createProjectContext.data?.project_id?.[0] ??
  createProjectContext.data?.[0]?.project_id;

if (!contextProjectId) {
  throw new Error(
    `createProjectContext returned no project_id. Result: ${JSON.stringify(createProjectContextResult)}`
  );
}

await generationStatus.setValue('confirming');

return { ok: true, orgId, projectId, contextProjectId };