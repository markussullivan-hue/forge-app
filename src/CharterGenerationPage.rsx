<Screen
  id="CharterGenerationPage"
  _customShortcuts={[]}
  _hashParams={[]}
  _order={0}
  _searchParams={[]}
  browserTitle="Charter Generation"
  title="Charter Generation"
  urlSlug="charter"
  uuid="48bad043-7081-4250-92f6-d938556da0c3"
>
  <Function
    id="artefactsByType"
    funcBody={include("../lib/artefactsByType.js", "string")}
  />
  <JavascriptQuery
    id="viewerStatesByType"
    notificationDuration={4.5}
    query={include("../lib/viewerStatesByType.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="artefactMap"
    notificationDuration={4.5}
    query={include("../lib/artefactMap.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="refreshCharterGenerationPage"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/refreshCharterGenerationPage.js", "string")}
    resourceName="JavascriptQuery"
    runWhenPageLoads={true}
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="latestRunForSelectedProject"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/latestRunForSelectedProject.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="debugDatabaseSnapshotForForge"
    query={include("../lib/debugDatabaseSnapshotForForge.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    warningCodes={[]}
  />
  <JavascriptQuery
    id="orderedArtefacts"
    notificationDuration={4.5}
    query={include("../lib/orderedArtefacts.js", "string")}
    resourceName="JavascriptQuery"
    showFailureToaster={false}
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="activeArtefact"
    notificationDuration={4.5}
    query={include("../lib/activeArtefact.js", "string")}
    resourceName="JavascriptQuery"
    showFailureToaster={false}
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getActiveProjectPdf"
    enableTransformer={true}
    query={include("../lib/getActiveProjectPdf.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showFailureToaster={false}
    showSuccessToaster={false}
    transformer="return formatDataAsArray(data);"
    warningCodes={[]}
  />
  <Include src="./drawerLatestRunDetails.rsx" />
  <Frame
    id="$main"
    enableFullBleed={false}
    isHiddenOnDesktop={false}
    isHiddenOnMobile={false}
    padding="8px 12px"
    type="main"
  >
    <Include src="./aiPortfolioDashboard.rsx" />
  </Frame>
</Screen>
