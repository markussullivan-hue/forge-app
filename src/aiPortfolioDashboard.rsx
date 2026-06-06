<Container
  id="aiPortfolioDashboard"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showHeader={true}
  style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
>
  <Header>
    <Image
      id="forgeLogoMain"
      heightType="fixed"
      horizontalAlign="center"
      retoolStorageFileId="2939f030-8450-435d-9363-ccd927bb0387"
      src="https://picsum.photos/id/1025/800/600"
      srcType="retoolStorageFileId"
    />
    <Button
      id="newProjectProgrammeButton"
      iconBefore="bold/interface-add-1"
      text="New Project / Programme"
    >
      <Event
        id="a1ae5d0d"
        event="click"
        method="openPage"
        params={{
          options: { map: { passDataWith: "urlParams" } },
          pageName: "FORGECharterGenerationWizard",
        }}
        pluginId=""
        type="util"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button
      id="regenerateArtefactsButton"
      disabled="{{ !currentOrgIdState.value || !selectedProjectIdState.value || runStagedGenerationPipeline.isFetching }}"
      iconBefore="bold/image-flash-2-alternate"
      loading="{{ runStagedGenerationPipeline.isFetching }}"
      text="Re-Generate artefacts"
      tooltipText="Manually trigger initial artefact generation for an existing entity"
    >
      <Event
        id="b8ea48ac"
        event="click"
        method="run"
        params={{
          map: {
            src: "// Regenerate artefacts orchestration (CharterGenerationPage scope).\n// Triggers the workflow synchronously, then refreshes the page and notifies.\n// Wizard-only state (generationStartedAt, generationStatus, currentRunIdState,\n// pollGenerationProgress, finaliseGenerationOnComplete, etc.) is deliberately\n// NOT referenced here — it lives on FORGECharterGenerationWizard and stays there.\n\nawait getCurrentUserId.trigger();\n\ntry {\n  await runStagedGenerationPipeline.trigger();\n\n  await Promise.all([\n    getGenerationRunsQuery.trigger(),\n    getCurrentArtefactsForEntity.trigger(),\n    viewerStatesByType.trigger(),\n  ]);\n  await refreshCharterGenerationPage.trigger();\n\n  utils.showNotification({\n    title: 'Artefacts regenerated',\n    description: 'The selected project has been regenerated and the page has been refreshed.',\n    notificationType: 'success',\n  });\n} catch (err) {\n  utils.showNotification({\n    title: 'Regeneration failed',\n    description: String(err?.message || err || 'The regeneration run failed. Check the latest run status.'),\n    notificationType: 'error',\n  });\n}",
          },
        }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Select
      id="projectSelect"
      data="{{ formatDataAsArray(getProjectsForSelector.data || []) }}"
      emptyMessage="No options"
      hideLabel={true}
      label="           Existing Delivery Project"
      labelPosition="top"
      labels="{{ (item.project_name && item.project_name.trim() !== '' ? item.project_name : '[Unnamed project]') + ' | ' + item.project_code }}"
      overlayMaxHeight={375}
      placeholder="Select a project"
      showSelectionIndicator={true}
      style={{ border: "secondary", boxShadow: "mediumElevation" }}
      value="{{ selectedProjectIdState.value }}"
      values="{{ item.project_id }}"
    >
      <Event
        id="332a1229"
        event="change"
        method="run"
        params={{
          map: {
            src: "if (projectSelect.value && projectSelect.value !== selectedProjectIdState.value) {\n  await selectedArtefactCodeState.setValue(null);\n  await selectedProjectIdState.setValue(projectSelect.value);\n  await refreshCharterGenerationPage.trigger();\n}",
          },
        }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </Select>
    <Include src="./cardProjectArrivalSummary.rsx" />
  </Header>
  <View id="00030" viewKey="View 1">
    <Text
      id="userInformationText"
      horizontalAlign="center"
      value="###### The tabs below will provide you with summary information. For the full documents, please use the Preview button and/or Download."
      verticalAlign="center"
    />
    <Include src="./tabbedContainerProjectCharter.rsx" />
    <Button
      id="previewPDFButton"
      disabled="{{ !getActiveProjectPdf.data?.[0]?.pdfmonkey_preview_url }}"
      text="Preview PDF"
      tooltipText="{{ getActiveProjectPdf.data?.[0]?.pdfmonkey_preview_url ? 'Open the generated PDF preview.' : 'PDF preview is not available yet.' }}"
    >
      <Event
        id="1ac3c2de"
        event="click"
        method="openUrl"
        params={{
          map: {
            url: "{{ getActiveProjectPdf.data?.[0]?.pdfmonkey_preview_url }}",
          },
        }}
        pluginId=""
        type="util"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button
      id="downloadPDFButton"
      disabled="	{{ !getActiveProjectPdf.data?.[0]?.pdfmonkey_download_url }}"
      text="Download PDF"
      tooltipText="{{ getActiveProjectPdf.data?.[0]?.pdfmonkey_download_url ? 'Download the generated PDF.' : 'PDF download is not available yet.' }}"
    >
      <Event
        id="ab1b8b77"
        event="click"
        method="openUrl"
        params={{
          map: {
            url: "{{ getActiveProjectPdf.data?.[0]?.pdfmonkey_download_url }}",
          },
        }}
        pluginId=""
        type="util"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Spacer id="spacer12" hidden="false" />
    <Text
      id="aiWarningText"
      value="Please keep in mind that FORGE Logic&trade; AI is not  perfect. We recommend reviewing the output to ensure it meets your needs."
      verticalAlign="center"
    />
  </View>
</Container>
