<Container
  id="containerGenerationError"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  hidden="{{ generationStatus.value !== 'error' }}"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Text
      id="containerTitle9"
      value="#### Container title"
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <Text
      id="errorHeading"
      disableMarkdown={true}
      horizontalAlign="center"
      style={{ map: { background: "danger" } }}
      value="⚠ Generation failed

  Something went wrong while generating the pack. The project record was created, but the artefact pack was not."
      verticalAlign="center"
    />
    <Text
      id="errorDetail"
      horizontalAlign="center"
      value="{{ generationError.value || 'No error details available.' }}"
      verticalAlign="center"
    />
    <Text
      id="errorGuidance"
      horizontalAlign="center"
      value="You can retry the generation, or close this window and try again later from the project dashboard."
      verticalAlign="center"
    />
    <Button
      id="errorCloseButton"
      style={{ map: { background: "secondary" } }}
      text="Close"
    >
      <Event
        id="d493af47"
        event="click"
        method="setValue"
        params={{ map: { value: "idle" } }}
        pluginId="generationStatus"
        type="state"
        waitMs="0"
        waitType="debounce"
      />
      <Event
        id="ab6fba98"
        event="click"
        method="hide"
        params={{}}
        pluginId="confirmGenerationModal"
        type="widget"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button id="errorRetryButton" text="Try again">
      <Event
        id="9e5aabff"
        event="click"
        method="trigger"
        params={{}}
        pluginId="runArtefactsGeneration"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
  </View>
</Container>
