<Container
  id="containerScopeDimensions"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Text
      id="containerDimensionsAndScope"
      value="#### Dimensions & Scope of Delivery"
      verticalAlign="center"
    />
    <Text
      id="text2"
      value="Provide a quick snapshot of size, risk, and what’s in scope. Scope details will be refined later."
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <RadioGroup
      id="radioGroupReadiness"
      captionByIndex="{{ item.caption }}"
      data={
        '[\n     { label: "Low",    value: "Low",    caption: "First-time work; significant uncertainty in approach." },\n     { label: "Medium", value: "Medium", caption: "Some prior experience; moderate confidence in approach." },\n     { label: "High",   value: "High",   caption: "Routine work; high confidence in approach." }\n   ]'
      }
      label="Organisational readiness"
      labelPosition="top"
      labels="{{ item.label }}"
      required={true}
      tooltipText="How prepared is the organisation for this kind of work — based on prior experience and confidence in approach."
      value=""
      values="{{ item.value }}"
    />
    <RadioGroup
      id="radioGroupScale"
      captionByIndex="{{ item.scale ? '' : '' }}"
      data="{{ getCreateScale.data }}"
      label="Scale"
      labelPosition="top"
      labels="{{ item.scale }}"
      required={true}
      tooltipText="Choose the overall scale of the initiative. Think about reach, spend, people affected, systems touched, and delivery effort.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Help me classify the scale of an IT project affecting <scope>."
      value=""
      values="{{ item.scale }}"
    />
    <RadioGroup
      id="radioGroupComplexity"
      captionByIndex="{{ item.complexity_level ? '' : '' }}"
      data="{{ getCreatComplexityLevels.data }}"
      label="Complexity"
      labelPosition="top"
      labels="{{ item.complexity_level }}"
      required={true}
      tooltipText="Choose the complexity based on moving parts: number of teams, integrations, dependencies, data issues, vendor involvement, regulation, and uncertainty.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Help me assess project complexity for an initiative involving <topic>."
      value=""
      values="{{ item.complexity_level }}"
    />
    <Spacer id="spacer4" />
    <Multiselect
      id="multiselectBusinessDrivers"
      captionByIndex="{{ item.code ? '' : '' }}"
      data="{{ formatDataAsArray(getCreateBusinessDrivers.data) }}"
      emptyMessage="No options"
      label="Business Drivers"
      labelPosition="top"
      labels=""
      minCount="1"
      overlayMaxHeight={375}
      placeholder="Select options"
      required={true}
      showSelectionIndicator={true}
      tooltipText="Choose the main reasons this initiative exists. Examples may include regulatory compliance, cost reduction, customer improvement, risk reduction, operational efficiency, revenue growth, or strategic change.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: What are the likely business drivers for a project about <topic>?"
      values="{{ item.label}}"
      wrapTags={true}
    />
    <Multiselect
      id="multiselectImpactedFunctions"
      captionByIndex="{{ item.code ? '' : '' }}"
      data="{{ formatDataAsArray(getCreateFunctions.data) }}"
      emptyMessage="No options"
      label="Impacted Functions"
      labelPosition="top"
      labels=""
      overlayMaxHeight={375}
      placeholder="Select an option"
      required={true}
      showSelectionIndicator={true}
      tooltipText="Choose the functions that will change, contribute, or feel the impact. This may include Operations, Finance, Risk, Compliance, Customer Service, IT, Data, HR, or Procurement.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Which business functions are likely to be impacted by a project about <topic>?"
      values="{{ item.label }}"
      wrapTags={true}
    >
      <Option id="00030" value="Option 1" />
      <Option id="00031" value="Option 2" />
      <Option id="00032" value="Option 3" />
    </Multiselect>
    <Select
      id="selectLifeCycleStage"
      captionByIndex=""
      colorByIndex=""
      data="{{ getCreateLifecycleStage.data }}"
      disabledByIndex=""
      emptyMessage="No options"
      fallbackTextByIndex=""
      hidden="{{ !preferredDeliveryModelSelect.value || typeof preferredDeliveryModelSelect.value !== 'string' || preferredDeliveryModelSelect.selectedItem?.group_code === 'PROGRAMME_PORTFOLIO' }}"
      hiddenByIndex=""
      iconByIndex=""
      imageByIndex=""
      label="Lifecycle Stage"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select an option"
      required="{{ !!preferredDeliveryModelSelect.value && typeof preferredDeliveryModelSelect.value === 'string' && preferredDeliveryModelSelect.selectedItem?.group_code !== 'PROGRAMME_PORTFOLIO' }}"
      showSelectionIndicator={true}
      tooltipByIndex=""
      tooltipText="Choose the stage that best reflects where the initiative is now, not where you wish it was. Typical stages include idea, discovery, initiation, planning, delivery, transition, or closure.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Help me decide the right lifecycle stage for a project that is currently <situation>."
      values="{{ item.id }}"
    />
    <Spacer id="spacer1" />
    <Text
      id="text3"
      value="The POTI model (MSP) is a structured way to translate strategy into a target operating model that can be defined, challenged, and implemented. Rather than leaving the future state as a vague aspiration, it breaks it into four practical components: Processes, Organisation, Technology, and Information. Used properly, it helps connect strategic ambition to the real capabilities and changes needed to make the model work."
      verticalAlign="center"
    />
    <Text
      id="textScopeProcesses"
      value="**Processes** - {{ formatDataAsArray(getCreateScopes.data)[2]?.help_text || 'Processes help text not available' }}"
      verticalAlign="center"
    />
    <Text
      id="textScopeOrganisation"
      value="**Organisation** - {{ formatDataAsArray(getCreateScopes.data)[1]?.help_text || 'Processes help text not available' }}"
      verticalAlign="center"
    />
    <Text
      id="textScopeTechnology"
      value="**Technology** - {{ formatDataAsArray(getCreateScopes.data)[3]?.help_text || 'Processes help text not available' }}"
      verticalAlign="center"
    />
    <Text
      id="textScopeInformation"
      value="**Information** - {{ formatDataAsArray(getCreateScopes.data)[0]?.help_text || 'Processes help text not available' }}"
      verticalAlign="center"
    />
    <Spacer id="spacer8" />
    <CheckboxGroup
      id="checkboxGroupPOTIProcesses"
      data="{{ getCreateScopesProcesses.data }}"
      label=""
      labelPosition="top"
      value=""
      values="{{ item.scope_type }}"
    />
    <CheckboxGroup
      id="checkboxGroupPOTIOrganisation"
      data="{{ getCreateScopesOrganisation.data }}"
      label=""
      labelPosition="top"
      value=""
      values="{{ item.scope_type }}"
    />
    <CheckboxGroup
      id="checkboxGroupPOTITechnology"
      data="{{ getCreateScopesTechnology.data }}"
      label=""
      labelPosition="top"
      value=""
      values="{{ item.code }}"
    />
    <CheckboxGroup
      id="checkboxGroupPOTIInformation"
      data="{{ getCreateScopesInformation.data }}"
      label=""
      labelPosition="top"
      value=""
      values="{{ item.scope_type }}"
    />
  </View>
</Container>
