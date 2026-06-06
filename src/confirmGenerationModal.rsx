<ModalFrame
  id="confirmGenerationModal"
  footerPadding="8px 12px"
  headerPadding="8px 12px"
  hidden="{{ generationStatus.value === 'idle' }}"
  hideOnEscape={true}
  isHiddenOnMobile={true}
  padding="8px 12px"
  showFooter={true}
  showHeader={true}
  showOverlay={true}
  size="medium"
>
  <Header>
    <Text
      id="modalGenerateGovernancePack"
      horizontalAlign="center"
      value="### Generate governance pack"
      verticalAlign="center"
    />
  </Header>
  <Body>
    <Container
      id="containerGenerateGovernancePack"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showBorder={false}
      showHeader="false"
    >
      <View id="00030" viewKey="View 1">
        <Text
          id="modalConfirmText"
          hidden="{{ generationStatus.value !== 'confirming' }}"
          horizontalAlign="center"
          value="**Ready to generate the governance pack for {{ initiativeName.value || 'this initiative' }}.**

This will take around 90 seconds. You'll see live progress here."
          verticalAlign="center"
        />
        <Include src="./containerGenerationError.rsx" />
        <Container
          id="containerGenerationResults"
          footerPadding="4px 12px"
          headerPadding="4px 12px"
          hidden="{{ generationStatus.value !== 'complete' }}"
          padding="12px"
          showBody={true}
          showHeader={true}
        >
          <View id="00030" viewKey="View 1">
            <Text
              id="textPackGeneration"
              disableMarkdown={true}
              horizontalAlign="center"
              value="✓ Pack generated

  {{ initiativeName.value || 'Your governance pack' }} is ready."
              verticalAlign="center"
            />
            <Button
              id="resultsPreviewButton"
              style={{ activeBackground: "secondary", background: "secondary" }}
              text="Preview PDF"
            >
              <Event
                id="094be369"
                event="click"
                method="openUrl"
                params={{
                  map: {
                    url: "{{ generationResult.value?.pdfmonkey_preview_url }}",
                  },
                }}
                pluginId=""
                type="util"
                waitMs="0"
                waitType="debounce"
              />
            </Button>
            <Button id="resultsDownloadButton" text="Download PDF">
              <Event
                id="455a1b5c"
                event="click"
                method="openUrl"
                params={{
                  map: {
                    url: "{{ generationResult.value?.pdfmonkey_download_url }}",
                  },
                }}
                pluginId=""
                type="util"
                waitMs="0"
                waitType="debounce"
              />
            </Button>
            <Button
              id="resultsCloseButton"
              style={{ map: { background: "secondary" } }}
              text="Done"
            >
              <Event
                id="ca476c0b"
                event="click"
                method="setValue"
                params={{ map: { value: "idle" } }}
                pluginId="generationStatus"
                type="state"
                waitMs="0"
                waitType="debounce"
              />
              <Event
                id="b0b3961f"
                event="click"
                method="hide"
                params={{}}
                pluginId="confirmGenerationModal"
                type="widget"
                waitMs="0"
                waitType="debounce"
              />
              <Event
                id="7c45c09c"
                event="click"
                method="openPage"
                params={{
                  options: { map: { passDataWith: "urlParams" } },
                  pageName: "CharterGenerationPage",
                }}
                pluginId=""
                type="util"
                waitMs="0"
                waitType="debounce"
              />
            </Button>
          </View>
        </Container>
        <Container
          id="containerGenerationProgress"
          footerPadding="4px 12px"
          headerPadding="4px 12px"
          hidden="{{ generationStatus.value !== 'running' }}"
          padding="12px"
          showBody={true}
          showHeader="false"
        >
          <View id="00030" viewKey="View 1">
            <Text
              id="progressHeading"
              disableMarkdown={true}
              horizontalAlign="center"
              value="**Generating governance pack…**"
              verticalAlign="center"
            />
            <Text
              id="progressStageText"
              horizontalAlign="center"
              value="Stage {{ pollGenerationProgress.data?.stages_done?.[0] || 0 }} of 8: **{{ pollGenerationProgress.data?.current_stage?.[0] || 'starting' }}**"
              verticalAlign="center"
            />
            <ProgressCircle
              id="progressCircleGeneration"
              horizontalAlign="center"
              style={{ map: { fill: "highlight" } }}
              value="{{ ((pollGenerationProgress.data?.stages_done?.[0] || 0) / 8) * 100 }}"
            />
          </View>
        </Container>
      </View>
    </Container>
  </Body>
  <Footer>
    <Button
      id="modalCancelButton"
      disabled="{{ generationStatus.value === 'running' }}"
      hidden="{{ generationStatus.value !== 'confirming' }}"
      iconAfter="bold/interface-content-fire-alternate"
      iconBefore="bold/interface-content-fire-alternate"
      style={{ map: { icon: "danger" } }}
      text="Cancel"
    >
      <Event
        id="087e8eb9"
        event="click"
        method="setValue"
        params={{ map: { value: "idle" } }}
        pluginId="generationStatus"
        type="state"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button
      id="modalGenerateButton"
      disabled="{{ generationStatus.value === 'running' || !initiativeName.value }}"
      hidden="{{ generationStatus.value !== 'confirming' }}"
      iconBefore="bold/image-flash-2-alternate"
      loading="{{ generationStatus.value === 'running' }}"
      style={{ map: { background: "warning" } }}
      text="Generate"
    >
      <Event
        id="0c92f29b"
        event="click"
        method="trigger"
        params={{}}
        pluginId="runArtefactsGeneration"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
  </Footer>
</ModalFrame>
