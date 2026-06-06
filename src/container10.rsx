<Container
  id="container10"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Text
      id="containerTitle4"
      value="#### Delivery & Resource Shape"
      verticalAlign="center"
    />
    <Text
      id="text6"
      value="Purpose: improve role matrix, effort assumptions and capability needs."
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <Select
      id="resourceModelSelect"
      data="{{ getResourceModelOptions.data }}"
      emptyMessage="No options"
      fallbackTextByIndex=""
      label="Resource model"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select an option"
      showSelectionIndicator={true}
      values="{{ item.value }}"
    />
    <Multiselect
      id="keyRolesRequiredMultiselect"
      data="{{ getKeyRoleOptions.data }}"
      emptyMessage="No options"
      fallbackTextByIndex=""
      label="Key roles required"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select options"
      showSelectionIndicator={true}
      values="{{ item.value }}"
      wrapTags={true}
    />
    <Multiselect
      id="stakeholderGroupsMultiselect"
      data="{{ getStakeholderGroupOptions.data }}"
      emptyMessage="No options"
      fallbackTextByIndex=""
      label="Stakeholder groups"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select options"
      showSelectionIndicator={true}
      values="{{ item.value }}"
      wrapTags={true}
    />
  </View>
</Container>
