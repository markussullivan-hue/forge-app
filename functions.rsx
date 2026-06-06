<GlobalFunctions>
  <SqlQueryUnified
    id="getGenerationRunsQuery"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("./lib/getGenerationRunsQuery.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getBusinessDrivers"
    notificationDuration={4.5}
    query={include("./lib/getBusinessDrivers.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <WorkflowRun
    id="runStagedGenerationPipeline"
    confirmationMessage="This will regenerate the artefacts for the selected project and may replace the current versions. Continue?"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    queryTimeout="120000"
    resourceName="WorkflowRun"
    showFailureToaster={false}
    showSuccessToaster={false}
    workflowId="b5ecc0c6-1732-4bc9-a7a9-0e0425e38e5f"
    workflowParams={include("./lib/runStagedGenerationPipeline.json", "string")}
  />
  <SqlQueryUnified
    id="getFunctions"
    notificationDuration={4.5}
    query={include("./lib/getFunctions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getProjectsColumnDefaults"
    notificationDuration={4.5}
    query={include("./lib/getProjectsColumnDefaults.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    runWhenPageLoads={true}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getProjectsRequiredColumns"
    notificationDuration={4.5}
    query={include("./lib/getProjectsRequiredColumns.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    runWhenPageLoads={true}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getProjectsDomains"
    notificationDuration={4.5}
    query={include("./lib/getProjectsDomains.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="previewCreateProjectReturnShape"
    notificationDuration={4.5}
    query={include("./lib/previewCreateProjectReturnShape.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getSampleProjectIdShape"
    notificationDuration={4.5}
    query={include("./lib/getSampleProjectIdShape.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <State id="currentOrgIdState" value="" />
  <SqlQueryUnified
    id="getCurrentOrgId"
    notificationDuration={4.5}
    query={include("./lib/getCurrentOrgId.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  >
    <Event
      id="f2fc90b6"
      event="failure"
      method="run"
      params={{
        map: {
          src: "currentOrgIdState.setValue(null)\nutils.showNotification({\n  title: 'Failed to resolve organisation',\n  description: getCurrentOrgId.error?.message || 'Unable to fetch current organisation.',\n  notificationType: 'error',\n})",
        },
      }}
      pluginId=""
      type="script"
      waitMs="0"
      waitType="debounce"
    />
    <Event
      id="1ed84c30"
      event="success"
      method="run"
      params={{
        map: {
          src: "const orgId = getCurrentOrgId.data?.org_id?.[0]\n\nif (orgId) {\n  currentOrgIdState.setValue(orgId)\n} else {\n  currentOrgIdState.setValue(null)\n  utils.showNotification({\n    title: 'No organisation found',\n    description: 'Your user is not assigned to an active organisation.',\n    notificationType: 'error',\n  })\n}",
        },
      }}
      pluginId=""
      type="script"
      waitMs="0"
      waitType="debounce"
    />
  </SqlQueryUnified>
  <State id="createdOrgIdState" />
  <SqlQueryUnified
    id="getCurrentUserId"
    query={include("./lib/getCurrentUserId.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    runWhenPageLoads={true}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getProjectsForSelector"
    query={include("./lib/getProjectsForSelector.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <State id="selectedProjectIdState" value="" />
  <SqlQueryUnified
    id="getOsScopePotiOptions"
    notificationDuration={4.5}
    query={include("./lib/getOsScopePotiOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getOsScopeProcessesOptions"
    notificationDuration={4.5}
    query={include("./lib/getOsScopeProcessesOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getOsScopeOrganisationOptions"
    notificationDuration={4.5}
    query={include("./lib/getOsScopeOrganisationOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getOsScopeInformationOptions"
    notificationDuration={4.5}
    query={include("./lib/getOsScopeInformationOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getOsScopeTechnologyOptions"
    notificationDuration={4.5}
    query={include("./lib/getOsScopeTechnologyOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getOsItSystemTypesOptions"
    notificationDuration={4.5}
    query={include("./lib/getOsItSystemTypesOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
  />
  <State id="createdProjectIdState" />
  <SqlQueryUnified
    id="getCurrentArtefactsForEntity"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("./lib/getCurrentArtefactsForEntity.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    showUpdateSetValueDynamicallyToggle={false}
    updateSetValueDynamically={true}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCurrentObservationsForEntity"
    query={include("./lib/getCurrentObservationsForEntity.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    warningCodes={[]}
  />
  <State id="selectedArtefactCodeState" />
</GlobalFunctions>
