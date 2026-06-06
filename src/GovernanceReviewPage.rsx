<Screen
  id="GovernanceReviewPage"
  _customShortcuts={[]}
  _hashParams={[]}
  _order={3}
  _searchParams={[]}
  browserTitle={null}
  title={null}
  urlSlug={null}
  uuid="03647d08-6d57-457e-a6f0-e40c45c274a8"
>
  <JavascriptQuery
    id="materialTypeOptions"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/materialTypeOptions.js", "string")}
    resourceName="JavascriptQuery"
    runWhenPageLoads={true}
    showSuccessToaster={false}
  >
    <Event
      id="e2bcdf77"
      event="success"
      method="trigger"
      params={{}}
      pluginId="reviewInputValidation"
      type="datasource"
      waitMs="0"
      waitType="debounce"
    />
  </JavascriptQuery>
  <JavascriptQuery
    id="aiRelevanceOptions"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/aiRelevanceOptions.js", "string")}
    resourceName="JavascriptQuery"
    runWhenPageLoads={true}
    showSuccessToaster={false}
  >
    <Event
      id="215295e3"
      event="success"
      method="trigger"
      params={{}}
      pluginId="reviewInputValidation"
      type="datasource"
      waitMs="0"
      waitType="debounce"
    />
  </JavascriptQuery>
  <JavascriptQuery
    id="methodologyLensOptions"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/methodologyLensOptions.js", "string")}
    resourceName="JavascriptQuery"
    runWhenPageLoads={true}
    showSuccessToaster={false}
  >
    <Event
      id="683266ed"
      event="success"
      method="trigger"
      params={{}}
      pluginId="reviewInputValidation"
      type="datasource"
      waitMs="0"
      waitType="debounce"
    />
  </JavascriptQuery>
  <JavascriptQuery
    id="reviewInputValidation"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/reviewInputValidation.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <WorkflowRun
    id="runGovernanceReviewQuery"
    enableTransformer={true}
    isMultiplayerEdited={false}
    resourceName="WorkflowRun"
    resourceTypeOverride=""
    showSuccessToaster={false}
    transformer="return data ?? null;"
    workflowId="a2edbd42-3ebe-48c9-a1e7-46f6101b7d21"
    workflowParams={include("../lib/runGovernanceReviewQuery.json", "string")}
  />
  <State id="currentGovernanceReviewId" />
  <JavascriptQuery
    id="prepareGovernanceReviewRun"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/prepareGovernanceReviewRun.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getGovernanceReviewResult"
    isMultiplayerEdited={false}
    query={include("../lib/getGovernanceReviewResult.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <JavascriptQuery
    id="runGovernanceReviewFlow"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/runGovernanceReviewFlow.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="clearGovernanceReviewForm"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/clearGovernanceReviewForm.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="clearGovernanceReviewResultOnly"
    notificationDuration={4.5}
    query={include("../lib/clearGovernanceReviewResultOnly.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="buildGovernanceReviewMarkdownExport"
    notificationDuration={4.5}
    query={include("../lib/buildGovernanceReviewMarkdownExport.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="debugGovernanceReviewExportSource"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/debugGovernanceReviewExportSource.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <State id="governanceReviewExportResultState" />
  <State id="activeGovernanceReviewIdState" />
  <JavascriptQuery
    id="debugSetGovernanceReviewInputs"
    notificationDuration={4.5}
    query={include("../lib/debugSetGovernanceReviewInputs.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="copyGovernanceReviewMarkdown"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/copyGovernanceReviewMarkdown.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  />
  <Frame
    id="$main4"
    enableFullBleed={false}
    isHiddenOnDesktop={false}
    isHiddenOnMobile={false}
    padding="8px 12px"
    sticky={null}
    type="main"
  >
    <Image
      id="image7"
      heightType="fixed"
      horizontalAlign="center"
      retoolStorageFileId="2939f030-8450-435d-9363-ccd927bb0387"
      src="https://picsum.photos/id/1025/800/600"
      srcType="retoolStorageFileId"
    />
    <Container
      id="governanceReviewInputSelect"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="governanceReviewInputSelectContainer"
          value="#### Initial Information"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Select
          id="methodologyLensSelect"
          data="{{ methodologyLensOptions.data }}"
          emptyMessage="No options"
          label="Methodology / governance lens"
          labelPosition="top"
          labels="{{ item.label }}"
          overlayMaxHeight={375}
          placeholder="Select an option"
          showSelectionIndicator={true}
          value={'{{ "general" }}'}
          values="{{ item.value }}"
        >
          <Event
            id="38060b53"
            event="change"
            method="trigger"
            params={{}}
            pluginId="clearGovernanceReviewResultOnly"
            type="datasource"
            waitMs="0"
            waitType="debounce"
          />
        </Select>
        <Select
          id="materialTypeSelect"
          data="{{ materialTypeOptions.data }}"
          emptyMessage="No options"
          label="Material type"
          labelPosition="top"
          labels="{{ item.label }}"
          overlayMaxHeight={375}
          placeholder="Select an option"
          showSelectionIndicator={true}
          values="{{ item.value }}"
        >
          <Event
            id="5662d12c"
            event="change"
            method="trigger"
            params={{}}
            pluginId="clearGovernanceReviewResultOnly"
            type="datasource"
            waitMs="0"
            waitType="debounce"
          />
        </Select>
        <Select
          id="aiRelevanceSelect"
          data="{{ aiRelevanceOptions.data }}"
          emptyMessage="No options"
          label="AI relevance
"
          labelPosition="top"
          labels="{{ item.label }}"
          overlayMaxHeight={375}
          placeholder="Select an option"
          showSelectionIndicator={true}
          value={'{{ "possibly_ai_relevant" }}'}
          values="{{ item.value }}"
        >
          <Event
            id="432d825e"
            event="change"
            method="trigger"
            params={{}}
            pluginId="clearGovernanceReviewResultOnly"
            type="datasource"
            waitMs="0"
            waitType="debounce"
          />
        </Select>
      </View>
    </Container>
    <TextArea
      id="governanceTextInput"
      autoResize={true}
      label="Paste governance text"
      labelPosition="top"
      minLines={2}
      placeholder="Paste the governance pack, business case, charter, PID, steering paper or assurance material here."
      required={true}
    >
      <Event
        id="ebf94d49"
        event="change"
        method="trigger"
        params={{}}
        pluginId="reviewInputValidation"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
      <Event
        id="dd8063a0"
        event="change"
        method="trigger"
        params={{}}
        pluginId="clearGovernanceReviewResultOnly"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </TextArea>
    <Text
      id="reviewValidationMessage"
      value={
        '{{\n  (() => {\n    const validation = reviewInputValidation.data || {};\n    const errors = Array.isArray(validation.errors) ? validation.errors : [];\n    const warnings = Array.isArray(validation.warnings) ? validation.warnings : [];\n\n    const flowError =\n      runGovernanceReviewFlow.error?.message ||\n      runGovernanceReviewFlow.error ||\n      null;\n\n    if (flowError) {\n      return `Review failed: ${String(flowError)}`;\n    }\n\n    if (errors.length) {\n      return errors.map(error => `• ${error}`).join("\\n");\n    }\n\n    if (warnings.length) {\n      return warnings.map(warning => `• ${warning}`).join("\\n");\n    }\n\n    if (validation.canRun) {\n      return "Ready to review.";\n    }\n\n    return "Complete the required fields to run the review.";\n  })()\n}}'
      }
      verticalAlign="center"
    />
    <Button
      id="runReviewButton"
      disabled="{{ runGovernanceReviewFlow.isFetching || !reviewInputValidation.data?.canRun }}"
      loading="{{ runGovernanceReviewFlow.isFetching }}"
      text="Review governance pack"
    >
      <Event
        id="0ca1cabd"
        event="click"
        method="run"
        params={{
          map: {
            src: 'await governanceReviewExportResultState.setValue(null);\n\ntry {\n  const validationOutput = await reviewInputValidation.trigger();\n\n  const validation =\n    validationOutput?.data ||\n    validationOutput ||\n    reviewInputValidation.data ||\n    {};\n\n  if (!validation.canRun) {\n    const validationMessage =\n      Array.isArray(validation.errors) && validation.errors.length\n        ? validation.errors.join("\\n")\n        : "Complete the required fields before running the governance review.";\n\n    utils.showNotification({\n      title: "Review not ready",\n      description: validationMessage,\n      notificationType: "warning"\n    });\n\n    return {\n      success: false,\n      stopped_at: "reviewInputValidation",\n      validation\n    };\n  }\n\n  utils.showNotification({\n    title: "Governance review started",\n    description: "FORGE is reviewing the pasted governance material.",\n    notificationType: "info"\n  });\n\n  const flowOutput = await runGovernanceReviewFlow.trigger();\n\n  const flowData =\n    flowOutput?.data ||\n    flowOutput ||\n    runGovernanceReviewFlow.data ||\n    null;\n\n  const capturedResult =\n    flowData?.result ||\n    flowData?.display ||\n    flowData?.display_model ||\n    flowData?.data?.result ||\n    flowData?.data?.display ||\n    flowData?.data?.display_model ||\n    null;\n\n  if (!capturedResult) {\n    await governanceReviewExportResultState.setValue(null);\n\n    utils.showNotification({\n      title: "Review completed",\n      description: "The review ran, but no display/export result object was captured.",\n      notificationType: "warning"\n    });\n\n    return {\n      success: false,\n      stopped_at: "result_capture",\n      validation,\n      flow_output_type: typeof flowData,\n      flow_output_keys:\n        flowData && typeof flowData === "object"\n          ? Object.keys(flowData)\n          : [],\n      flow_output: flowData\n    };\n  }\n\n  await governanceReviewExportResultState.setValue(capturedResult);\n\n  utils.showNotification({\n    title: "Governance review complete",\n    description: "The review result is ready.",\n    notificationType: "success"\n  });\n\n  return {\n    success: true,\n    stopped_at: null,\n    validation,\n    export_result_captured: true,\n    captured_result_keys:\n      capturedResult && typeof capturedResult === "object"\n        ? Object.keys(capturedResult)\n        : [],\n    flow_output_keys:\n      flowData && typeof flowData === "object"\n        ? Object.keys(flowData)\n        : [],\n    review_id:\n      flowData?.review_id ||\n      flowData?.stored_row?.review_id ||\n      currentGovernanceReviewId.value ||\n      activeGovernanceReviewIdState.value ||\n      null\n  };\n} catch (err) {\n  const message = String(err?.message || err || "The governance review failed.");\n\n  await governanceReviewExportResultState.setValue(null);\n\n  utils.showNotification({\n    title: "Governance review failed",\n    description: message,\n    notificationType: "error"\n  });\n\n  return {\n    success: false,\n    stopped_at: "catch",\n    error: message,\n    runGovernanceReviewFlowError:\n      runGovernanceReviewFlow.error?.message ||\n      runGovernanceReviewFlow.error ||\n      null,\n    prepareGovernanceReviewRunError:\n      prepareGovernanceReviewRun.error?.message ||\n      prepareGovernanceReviewRun.error ||\n      null,\n    runGovernanceReviewQueryError:\n      runGovernanceReviewQuery.error?.message ||\n      runGovernanceReviewQuery.error ||\n      null,\n    getGovernanceReviewResultError:\n      getGovernanceReviewResult.error?.message ||\n      getGovernanceReviewResult.error ||\n      null\n  };\n}',
          },
        }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button
      id="clearReviewButton"
      disabled="{{ runGovernanceReviewFlow.isFetching }}"
      text="Clear Data"
    >
      <Event
        id="d6c696a4"
        event="click"
        method="trigger"
        params={{}}
        pluginId="clearGovernanceReviewForm"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Text
      id="reviewLoadingState"
      hidden="{{ !runGovernanceReviewFlow.isFetching }}"
      value="Reviewing governance pack..."
      verticalAlign="center"
    />
    <Include src="./reviewResultContainer.rsx" />
  </Frame>
</Screen>
