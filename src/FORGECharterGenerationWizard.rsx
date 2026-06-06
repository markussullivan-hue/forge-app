<Screen
  id="FORGECharterGenerationWizard"
  _customShortcuts={[]}
  _hashParams={[]}
  _order={1}
  _searchParams={[]}
  browserTitle="FORGEGenerator"
  title="ForgeGenerator"
  urlSlug="FORGEGenerator"
  uuid="33eb34cf-22ae-4461-8b65-7dd34edfd598"
>
  <State id="wizardStep" value="1" />
  <SqlQueryUnified
    id="getCreateBusinessDrivers"
    query={include("../lib/getCreateBusinessDrivers.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateFunctions"
    query={include("../lib/getCreateFunctions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateScopes"
    query={include("../lib/getCreateScopes.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateScopesInformation"
    query={include("../lib/getCreateScopesInformation.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateScopesOrganisation"
    query={include("../lib/getCreateScopesOrganisation.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateScopesTechnology"
    query={include("../lib/getCreateScopesTechnology.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateScopesProcesses"
    query={include("../lib/getCreateScopesProcesses.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateITSystemsTypes"
    query={include("../lib/getCreateITSystemsTypes.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <JavascriptQuery
    id="wizardReviewModel"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/wizardReviewModel.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getCreatComplexityLevels"
    isMultiplayerEdited={false}
    query={include("../lib/getCreatComplexityLevels.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateScale"
    query={include("../lib/getCreateScale.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateConfidenceLevel"
    query={include("../lib/getCreateConfidenceLevel.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateOrgFamiliarity"
    query={include("../lib/getCreateOrgFamiliarity.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="createProject"
    query={include("../lib/createProject.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="createProjectContext"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/createProjectContext.sql", "string")}
    queryDisabled="{{ 
  !(
    createProject.data?.org_id?.[0] ||
    createProject.data?.[0]?.org_id
  ) ||
  !(
    createProject.data?.project_id?.[0] ||
    createProject.data?.[0]?.project_id
  )
}}"
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    showUpdateSetValueDynamicallyToggle={false}
    updateSetValueDynamically={true}
    warningCodes={[]}
  />
  <JavascriptQuery
    id="runGenerateFlow"
    notificationDuration={4.5}
    query={include("../lib/runGenerateFlow.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <WorkflowRun
    id="triggerInitialArtefactsGeneration"
    isMultiplayerEdited={false}
    queryTimeout="120000"
    resourceName="WorkflowRun"
    showFailureToaster={false}
    showSuccessToaster={false}
    workflowId="b5ecc0c6-1732-4bc9-a7a9-0e0425e38e5f"
    workflowParams={include(
      "../lib/triggerInitialArtefactsGeneration.json",
      "string"
    )}
  />
  <State
    id="overviewValidationState"
    value={
      '{\n  projectProgrammeName: "",\n  description: "",\n  startDate: null,\n  endDate: null\n}'
    }
  />
  <SqlQueryUnified
    id="getCreateDeliveryType"
    query={include("../lib/getCreateDeliveryType.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getCreateServiceIndustryType"
    query={include("../lib/getCreateServiceIndustryType.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="deliveryModelSelect"
    query={include("../lib/deliveryModelSelect.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getDeliveryModelGroups"
    query={include("../lib/getDeliveryModelGroups.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getDeliveryModelsForGroup"
    enableTransformer={true}
    query={include("../lib/getDeliveryModelsForGroup.sql", "string")}
    queryDisabled="{{ !deliveryModelGroupSelect.value }}"
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getResourceModelOptions"
    query={include("../lib/getResourceModelOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getKeyRoleOptions"
    query={include("../lib/getKeyRoleOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getBudgetConfidenceOptions"
    notificationDuration={4.5}
    query={include("../lib/getBudgetConfidenceOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
    showUpdateSetValueDynamicallyToggle={false}
    updateSetValueDynamically={true}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getStakeholderGroupOptions"
    query={include("../lib/getStakeholderGroupOptions.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <State id="generationStartedAt" />
  <State id="generationStatus" value="idle" />
  <State id="generationResult" />
  <State id="generationError" />
  <SqlQueryUnified
    id="pollGenerationProgress"
    query={include("../lib/pollGenerationProgress.sql", "string")}
    queryDisabled="{{ generationStatus.value !== 'running' }}"
    queryRefreshTime="3000"
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showFailureToaster={false}
    showSuccessToaster={false}
    warningCodes={[]}
  >
    <Event
      id="5de70fbf"
      enabled="{{ pollGenerationProgress.data?.status?.[0] === 'Completed' && generationStatus.value === 'running' }}"
      event="success"
      method="trigger"
      params={{}}
      pluginId="finaliseGenerationOnComplete"
      type="datasource"
      waitMs="0"
      waitType="debounce"
    />
    <Event
      id="8f050eae"
      enabled="{{ pollGenerationProgress.data?.status?.[0] === 'Failed' && generationStatus.value === 'running' }}"
      event="success"
      method="setValue"
      params={{ map: { value: "error" } }}
      pluginId="generationStatus"
      type="state"
      waitMs="0"
      waitType="debounce"
    />
    <Event
      id="72daa693"
      enabled="{{ pollGenerationProgress.data?.status?.[0] === 'Failed' && generationStatus.value === 'running' }}"
      event="success"
      method="setValue"
      params={{ map: { value: "Workflow failed during generation." } }}
      pluginId="generationError"
      type="state"
      waitMs="0"
      waitType="debounce"
    />
    <Event
      id="8aea942f"
      enabled="{{ !currentRunIdState.value && pollGenerationProgress.data?.run_id?.[0] }}"
      event="success"
      method="setValue"
      params={{
        map: { value: "{{ pollGenerationProgress.data?.run_id?.[0] }}" },
      }}
      pluginId="currentRunIdState"
      type="state"
      waitMs="0"
      waitType="debounce"
    />
  </SqlQueryUnified>
  <JavascriptQuery
    id="runArtefactsGeneration"
    notificationDuration="4.5"
    query={include("../lib/runArtefactsGeneration.js", "string")}
    resourceName="JavascriptQuery"
    showFailureToaster={false}
    showSuccessToaster={false}
  />
  <State id="progressTickNow" />
  <JavascriptQuery
    id="tickProgressNow"
    notificationDuration={4.5}
    query={include("../lib/tickProgressNow.js", "string")}
    queryDisabled="{{ generationStatus.value !== 'running' }}"
    queryRefreshTime="1000"
    resourceName="JavascriptQuery"
    showFailureToaster={false}
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="finaliseGenerationOnComplete"
    notificationDuration={4.5}
    query={include("../lib/finaliseGenerationOnComplete.js", "string")}
    resourceName="JavascriptQuery"
    showFailureToaster={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="diagnosticGenerationRunsLatest5"
    notificationDuration={4.5}
    query={include("../lib/diagnosticGenerationRunsLatest5.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="diagnosticGenerationRunsLatest5Json"
    notificationDuration={4.5}
    query={include("../lib/diagnosticGenerationRunsLatest5Json.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="prefillPresetMinimal"
    notificationDuration={4.5}
    query={include("../lib/prefillPresetMinimal.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="prefillPresetTypical"
    notificationDuration={4.5}
    query={include("../lib/prefillPresetTypical.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="prefillPresetRegulated"
    notificationDuration={4.5}
    query={include("../lib/prefillPresetRegulated.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getCreateLifecycleStage"
    query={include("../lib/getCreateLifecycleStage.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getLatestPdfForEntity"
    query={include("../lib/getLatestPdfForEntity.sql", "string")}
    queryTimeout="120000"
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showFailureToaster={false}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <State id="currentRunIdState" />
  <SqlQueryUnified
    id="createProjectSystems"
    notificationDuration={4.5}
    query={include("../lib/createProjectSystems.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    showUpdateSetValueDynamicallyToggle={false}
    updateSetValueDynamically={true}
    warningCodes={[]}
  />
  <State id="systemsSelectionState" value="[]" />
  <SqlQueryUnified
    id="getSystemCategories"
    enableTransformer={true}
    isMultiplayerEdited={false}
    query={include("../lib/getSystemCategories.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    showFailureToaster={false}
    transformer="return formatDataAsArray(data);"
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getSystems"
    enableTransformer={true}
    isMultiplayerEdited={false}
    query={include("../lib/getSystems.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    showFailureToaster={false}
    transformer="return formatDataAsArray(data);"
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getImpactBuckets"
    enableTransformer={true}
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/getImpactBuckets.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    showFailureToaster={false}
    showSuccessToaster={false}
    showUpdateSetValueDynamicallyToggle={false}
    transformer="return formatDataAsArray(data);"
    updateSetValueDynamically={true}
    warningCodes={[]}
  />
  <State id="expandedCategoriesState" value="{}" />
  <State id="noteExpandedState" value="{}" />
  <State id="variable20" />
  <Include src="./confirmGenerationModal.rsx" />
  <Frame
    id="$main2"
    enableFullBleed={false}
    isHiddenOnDesktop={false}
    isHiddenOnMobile={false}
    padding="8px 12px"
    sticky={null}
    type="main"
  >
    <Container
      id="containerHomePageTitle"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Image
          id="FORGELogo"
          heightType="fixed"
          horizontalAlign="center"
          retoolStorageFileId="2939f030-8450-435d-9363-ccd927bb0387"
          src="https://picsum.photos/id/1025/800/600"
          srcType="retoolStorageFileId"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="homepageIntroduction"
          horizontalAlign="center"
          style={{}}
          value="##### Capture the essential inputs for a new initiative in four structured steps. Once confirmed, FORGE uses AI to shape the initial governance and delivery artefacts, casting the foundation needed to establish direction, control, and momentum."
          verticalAlign="center"
        />
      </View>
    </Container>
    <Include src="./steppedContainerHomepage.rsx" />
    <Text
      id="text12"
      value="{{
  (() => {
    const isBlank = (v) =>
      v===null||v===undefined||v===''||(typeof v==='string'&&v.trim()==='')||(Array.isArray(v)&&v.length===0);
    const sel = Array.isArray(systemsSelectionState.value)?systemsSelectionState.value:[];
    const start = initiativeTargetStartDate.value?new Date(initiativeTargetStartDate.value):null;
    const end = initiativeTargetEndDate.value?new Date(initiativeTargetEndDate.value):null;
    const datesInvalid=(()=>{if(!start||!end)return true;start.setHours(0,0,0,0);end.setHours(0,0,0,0);const m=new Date(start);m.setMonth(m.getMonth()+1);return end<m;})();
    const checks={
      NOT_on_review_tab: steppedContainerHomepage.currentViewIndex!==4,
      fetching: runGenerateFlow.isFetching,
      initiativeName: isBlank(initiativeName.value),
      initiativeDescription: isBlank(initiativeDescription.value),
      initiativeBudget: isBlank(initiativeBudget.value),
      startDate: isBlank(initiativeTargetStartDate.value),
      endDate: isBlank(initiativeTargetEndDate.value),
      serviceIndustry: isBlank(initiativeServiceIndustrySelect.value),
      datesInvalid: datesInvalid,
      scale: isBlank(radioGroupScale.value),
      complexity: isBlank(radioGroupComplexity.value),
      readiness: isBlank(radioGroupReadiness.value),
      businessDrivers: isBlank(multiselectBusinessDrivers.value),
      impactedFunctions: isBlank(multiselectImpactedFunctions.value),
      lifecycle: isBlank(selectLifeCycleStage.value),
      potiProcesses: isBlank(checkboxGroupPOTIProcesses.value),
      potiOrg: isBlank(checkboxGroupPOTIOrganisation.value),
      potiTech: isBlank(checkboxGroupPOTITechnology.value),
      potiInfo: isBlank(checkboxGroupPOTIInformation.value),
      businessProblem: isBlank(textInputBusinessProblem.value),
      strategicObjectives: isBlank(textInputStrategicObjectives.value),
      noSystemsSelected: sel.length===0,
      othersInvalid: sel.some(r=>r.systemId===null&&isBlank(r.customSystemName)),
      bucketsInvalid: sel.some(r=>isBlank(r.impactBucketCode))
    };
    const blocking = Object.keys(checks).filter(k => checks[k]);
    return 'BLOCKING: ' + (blocking.join(', ') || 'none — Generate should be enabled');
  })()
}}"
      verticalAlign="center"
    />
  </Frame>
</Screen>
