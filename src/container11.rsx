<Container
  id="container11"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Text
      id="containerTitle5"
      value="#### Financial, Quality & Assurance Inputs"
      verticalAlign="center"
    />
    <Text
      id="textHelpInfoFinancial"
      value="Purpose: strengthen funding assumptions, cost drivers and quality plan."
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <Select
      id="budgetConfidenceSelect"
      data="{{ getBudgetConfidenceOptions.data }}"
      emptyMessage="No options"
      fallbackTextByIndex=""
      label="Budget confidence"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select an option"
      showSelectionIndicator={true}
      values="{{ item.value }}"
    />
    <TextInput
      id="budgetNotesInput"
      label="Budget notes"
      labelPosition="top"
      placeholder="Enter any issues or constraints."
    />
    <TextInput
      id="qualityAssuranceExpectationsInput"
      label="Quality / assurance expectations"
      labelPosition="top"
      placeholder="List required reviews, assurance gates, testing expectations, compliance checks or sign-offs."
    />
  </View>
</Container>
