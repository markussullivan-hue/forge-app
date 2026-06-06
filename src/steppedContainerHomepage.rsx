<Container
  id="steppedContainerHomepage"
  currentViewKey="{{ self.viewKeys[0] }}"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showFooter={true}
  showHeader={true}
>
  <Header>
    <Steps
      id="stepsCreateProjectFlow"
      horizontalAlign="center"
      itemMode="static"
      navigateContainer={true}
      showStepNumbers={true}
      targetContainerId="steppedContainerHomepage"
      value="{{ self.values[0] }}"
    >
      <Option id="00030" value="Step 1" />
      <Option id="00031" value="Step 2" />
      <Option id="00032" value="Step 3" />
    </Steps>
  </Header>
  <View id="00030" label="Overview" viewKey="Step 1">
    <Include src="./containerInitiativeOverview.rsx" />
  </View>
  <View id="00032" label="Context & Systems" viewKey="Step 3">
    <Text
      id="titleContextAndSystems"
      value="#### Context"
      verticalAlign="center"
    />
    <Text
      id="bodyContextAndSystems"
      value="Capture the business context, operating environment, and key systems affected. This provides the delivery backdrop and will be refined later."
      verticalAlign="center"
    />
    <Spacer id="spacer3" />
    <TextInput
      id="textInputStrategicObjectives"
      customValidation="{{ (() => {
  const raw = textInputStrategicObjectives.value ?? '';
  const value = String(raw).trim();

  if (!value) {
    return 'Enter a strategic objective.';
  }

  const bannedPatterns = [
    /\breplace\b/i,
    /\breplacement\b/i,
    /\bupgrade\b/i,
    /\brebuild\b/i,
    /\bmigrate\b/i,
    /\bmigration\b/i,
    /\bdecommission\b/i,
    /\bretire\b/i,
    /\bimplement\b/i,
    /\bbuild\b/i,
    /\bengineer\b/i,
    /\benhance\b/i,
    /\boptimise\b/i,
    /\boptimize\b/i,
    /\bsolution\b/i,
    /\bsystem\b/i,
    /\bplatform\b/i,
    /\btool\b/i
  ];

  const hasBannedTerm = bannedPatterns.some(pattern => pattern.test(value));

  if (hasBannedTerm) {
    return 'Use a business outcome, not a solution statement. Remove words such as replace, upgrade, rebuild, migrate, implement, build, engineer, enhance, optimise, solution, system, platform or tool.';
  }

  return '';
})() }}"
      inputTooltip="Explain the end state you want, not just the activity. Focus on the business result, such as improved speed, lower risk, better controls, better customer experience, reduced cost, stronger reporting, or higher capacity.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Help me turn a business problem into 3 clear project objectives."
      label="Strategic Objectives"
      labelPosition="top"
      placeholder="We want to achieve <target outcome>"
      required={true}
    />
    <TextInput
      id="textInputBusinessProblem"
      inputTooltip="Describe the problem that exists today. Include what is going wrong, who is affected, and why it matters now. Useful themes include cost, delay, risk, compliance, customer impact, manual effort, poor data, missed revenue, or service failure.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Help me write a 2-sentence business problem statement for an IT project intake form. Ask me what is happening, who is affected, and why now."
      label="Business Problem"
      labelPosition="top"
      placeholder="The business is facing <problem>, causing <impact>"
      required={true}
    />
    <Spacer id="spacer5" />
    <Select
      id="deliveryModelGroupSelect"
      data="{{ getDeliveryModelGroups.data }}"
      emptyMessage="No options"
      label="Delivery method / governance approach"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select the broad method / framework family"
      required={true}
      showSelectionIndicator={true}
      values="{{ item.value }}"
    >
      <Event
        id="677f1996"
        event="change"
        method="trigger"
        params={{}}
        pluginId="getDeliveryModelsForGroup"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Select>
    <Select
      id="preferredDeliveryModelSelect"
      data="{{ formatDataAsArray(getDeliveryModelsForGroup.data || []) }}"
      emptyMessage="No options"
      label="Preferred framework / method"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select the specific framework or method"
      required={true}
      showSelectionIndicator={true}
      values="{{ item.value }}"
    />
    <Spacer id="spacer6" />
    <TextInput
      id="deliveryModelCustomInput"
      hidden="{{ preferredDeliveryModelSelect.selectedItem?.model_code !== 'CUSTOM' }}"
      label="Custom framework / method name"
      labelPosition="top"
      placeholder="Enter the organisation-specific, client-specific, or blended framework/method name."
    />
    <Container
      id="containerSystems"
      enableFullBleed={true}
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      heightType="fixed"
      overflowType="hidden"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text id="listSystems" value="#### Systems" verticalAlign="center" />
        <Container
          id="containerSystemSummary"
          footerPadding="4px 12px"
          headerPadding="4px 12px"
          padding="12px"
          showBody={true}
          showHeader={true}
        >
          <Header>
            <Text
              id="containerSummary"
              value="###### Systems Summary"
              verticalAlign="center"
            />
          </Header>
          <View id="00030" viewKey="View 1">
            <Text
              id="textSummaryBuckets"
              value={
                "{{ systemsSelectionState.value.filter(r=>r.impactBucketCode==='in_scope').length + \" in scope · \" + systemsSelectionState.value.filter(r=>r.impactBucketCode==='integration_touchpoint').length + \" integration · \" + systemsSelectionState.value.filter(r=>r.impactBucketCode==='existing_context').length + \" context\" }}"
              }
              verticalAlign="center"
            />
            <Text
              id="textSummaryCount"
              value={
                '{{ systemsSelectionState.value.length + " systems selected across " + [...new Set(systemsSelectionState.value.map(r => r.categoryId))].length + " categories" }}'
              }
              verticalAlign="center"
            />
          </View>
        </Container>
        <ListViewBeta
          id="gridCategories"
          _primaryKeys="{{ item.category_id }}"
          data="{{ getSystemCategories.data }}"
          formDataKey=""
          itemWidth="200px"
          layoutType="grid"
          margin="0"
          numColumns={3}
          padding="0"
        >
          <Container
            id="containerCategories"
            footerPadding="4px 12px"
            headerPadding="4px 12px"
            padding="12px"
            showBody={true}
            showHeader={true}
          >
            <Header>
              <Text
                id="containerTitleCategory"
                value="###### {{ item.category_name }}"
                verticalAlign="center"
              />
              <Text
                id="textSystemCount"
                value={
                  '{{ "#" + systemsSelectionState.value.filter(r => r.categoryId === gridCategories.item.category_id).length + "" }}'
                }
                verticalAlign="center"
              />
            </Header>
            <View id="00030" viewKey="View 1">
              <CheckboxGroup
                id="checkboxSystems"
                data="{{ (Array.isArray(getSystems.data) ? getSystems.data : []).filter(s => s.category_id === gridCategories.item.category_id) }}"
                heightType="fixed"
                label=""
                labelPosition="top"
                labels="{{ item.system_name }}"
                value=""
                values="{{ item.system_id }}"
              >
                <Event
                  id="11f239a7"
                  event="change"
                  method="run"
                  params={{
                    map: {
                      src: 'utils.showNotification({ title: JSON.stringify(checkboxSystems.value), notificationType: "success" });\nconst catId = gridCategories.item.category_id;\nconst selectedIds = checkboxSystems.value || [];\n\n// rows for OTHER categories stay untouched\nconst others = systemsSelectionState.value.filter(r => r.categoryId !== catId);\n\n// rebuild this category\'s NAMED rows from current ticks, preserving existing bucket/notes\nconst namedRows = selectedIds.map(sysId => {\n  const existing = systemsSelectionState.value.find(\n    r => r.categoryId === catId && r.systemId === sysId\n  );\n  return existing || {\n    categoryId: catId,\n    systemId: sysId,\n    customSystemName: null,\n    impactBucketCode: \'in_scope\',\n    notes: null\n  };\n});\n\n// keep any "Other" custom rows for this category (systemId === null)\nconst otherRowsThisCat = systemsSelectionState.value.filter(\n  r => r.categoryId === catId && r.systemId === null\n);\n\nsystemsSelectionState.setValue([...others, ...namedRows, ...otherRowsThisCat]);',
                    },
                  }}
                  pluginId=""
                  type="script"
                  waitMs="0"
                  waitType="debounce"
                />
              </CheckboxGroup>
            </View>
          </Container>
          <Button
            id="buttonAddOther"
            iconBefore="bold/interface-page-controller-scroll-up-down"
            style={{
              background: "canvas",
              fontSize: "h4Font",
              fontWeight: "h4Font",
              fontFamily: "h4Font",
              hoverBackground: "primary",
              icon: "primary",
            }}
          >
            <Event
              id="c6760db1"
              event="click"
              method="run"
              params={{
                map: {
                  src: "const catId = gridCategories.item.category_id;\nsystemsSelectionState.setValue([...systemsSelectionState.value, {\n  _key: 'oth_' + Date.now() + '_' + Math.floor(Math.random()*1e6),\n  categoryId: catId,\n  systemId: null,\n  customSystemName: null,\n  impactBucketCode: 'in_scope',\n  notes: null\n}]);",
                },
              }}
              pluginId=""
              type="script"
              waitMs="0"
              waitType="debounce"
            />
          </Button>
          <ListViewBeta
            id="listOther"
            _primaryKeys="{{ item._key }}"
            data="{{ systemsSelectionState.value.filter(r => r.systemId === null && r.categoryId === item.category_id) }}"
            itemWidth="200px"
            margin="0"
            numColumns={3}
            padding="0"
          >
            <Container
              id="containerOtherSystem"
              footerPadding="4px 12px"
              headerPadding="4px 12px"
              margin="0"
              padding="0"
              showBody={true}
            >
              <View id="00030" viewKey="View 1">
                <Button
                  id="buttonRemoveOther"
                  iconBefore="bold/interface-arrows-shrink-vertical"
                  style={{
                    activeBackground: "canvas",
                    background: "canvas",
                    icon: "danger",
                    fontSize: "h4Font",
                    fontWeight: "h4Font",
                    fontFamily: "h4Font",
                  }}
                >
                  <Event
                    id="1a91ed16"
                    event="click"
                    method="run"
                    params={{
                      map: {
                        src: "const k = listOther.item._key;\nsystemsSelectionState.setValue(systemsSelectionState.value.filter(r => r._key !== k));",
                      },
                    }}
                    pluginId=""
                    type="script"
                    waitMs="0"
                    waitType="debounce"
                  />
                </Button>
                <TextInput
                  id="inputOtherName"
                  label=""
                  labelPosition="top"
                  placeholder="Enter value"
                >
                  <Event
                    id="d02f6337"
                    event="blur"
                    method="run"
                    params={{
                      map: {
                        src: "const k = item._key;\nconst v = (inputOtherName.value || '').trim();\nconst next = systemsSelectionState.value.map(r =>\n  r._key === k ? { ...r, customSystemName: v || null } : r\n);\nsystemsSelectionState.setValue(next);",
                      },
                    }}
                    pluginId=""
                    type="script"
                    waitMs="0"
                    waitType="debounce"
                  />
                </TextInput>
              </View>
            </Container>
          </ListViewBeta>
        </ListViewBeta>
      </Header>
      <View id="00030" viewKey="View 1" />
    </Container>
    <Spacer id="spacer13" />
    <Text
      id="textConfigHeading"
      hidden="{{ systemsSelectionState.value.filter(r => r.systemId !== null).length === 0 }}"
      value="#### Configure selected systems"
      verticalAlign="center"
    />
    <ListViewBeta
      id="listSelectedConfig"
      _primaryKeys={'{{ "sys_" + item.systemId }}'}
      data="{{ systemsSelectionState.value.filter(r => r.systemId !== null) }}"
      hidden="{{ systemsSelectionState.value.filter(r => r.systemId !== null).length === 0 }}"
      itemWidth="200px"
      layoutType="grid"
      margin="0"
      numColumns="2
"
      padding="0"
    >
      <Text
        id="textConfigName"
        value="#### {{ (getSystemCategories.data.find(c => c.category_id === item.categoryId) || {}).category_name }}"
        verticalAlign="center"
      />
      <Text
        id="textConfigCategory"
        value="###### {{ (getSystems.data.find(s => s.system_id === item.systemId) || {}).system_name }}"
        verticalAlign="center"
      />
      <SegmentedControl
        id="segBucket"
        data="{{ getImpactBuckets.data }}"
        label=""
        labelPosition="top"
        labels="{{ item.display_label }}"
        margin="0"
        paddingType="spacious"
        value="{{ listSelectedConfig.item.impactBucketCode }}"
        values="{{ item.code }}"
      >
        <Event
          id="cbcf4106"
          event="change"
          method="run"
          params={{
            map: {
              src: "const sysId = listSelectedConfig.item.systemId;\nconst next = systemsSelectionState.value.map(r =>\n  r.systemId === sysId ? { ...r, impactBucketCode: segBucket.value } : r\n);\nsystemsSelectionState.setValue(next);",
            },
          }}
          pluginId=""
          type="script"
          waitMs="0"
          waitType="debounce"
        />
      </SegmentedControl>
      <Text
        id="textBucketHint"
        horizontalAlign="center"
        style={{ map: { color: "primary" } }}
        value="{{ (getImpactBuckets.data.find(b => b.code === listSelectedConfig.item.impactBucketCode) || {}).short_description }}"
        verticalAlign="center"
      />
      <Button id="buttonAddNote" horizontalAlign="center" text="Add note">
        <Event
          id="d564e4ec"
          event="click"
          method="run"
          params={{
            map: {
              src: "const id = listSelectedConfig.item.systemId;\nconst next = { ...noteExpandedState.value };\nif (next[id]) { delete next[id]; } else { next[id] = true; }\nnoteExpandedState.setValue(next);",
            },
          }}
          pluginId=""
          type="script"
          waitMs="0"
          waitType="debounce"
        />
      </Button>
      <TextArea
        id="textareaNote"
        autoResize={true}
        hidden="{{ !noteExpandedState.value[listSelectedConfig.item.systemId] }}"
        label=""
        labelPosition="top"
        maxLines="200"
        minLines={2}
        placeholder="Enter value"
        value="{{ listSelectedConfig.item.notes }}"
      >
        <Event
          id="186c72cf"
          event="blur"
          method="run"
          params={{
            map: {
              src: "const sysId = listSelectedConfig.item.systemId;\nconst v = (textareaNote.value || '').trim();\nconst next = systemsSelectionState.value.map(r =>\n  r.systemId === sysId ? { ...r, notes: v || null } : r\n);\nsystemsSelectionState.setValue(next);",
            },
          }}
          pluginId=""
          type="script"
          waitMs="0"
          waitType="debounce"
        />
      </TextArea>
    </ListViewBeta>
    <CheckboxGroup
      id="checkboxSystemTypes"
      data="{{ getCreateITSystemsTypes.data }}"
      label="System Types"
      labelPosition="top"
      labels="{{ item.label }}"
      required={true}
      value=""
      values="{{ item.value }}"
    />
  </View>
  <View
    id="8c635"
    disabled={false}
    hidden={false}
    iconPosition="left"
    label="Business Case Detail"
    viewKey="5"
  >
    <Container
      id="container8"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitle2"
          value="#### Scope Boundaries"
          verticalAlign="center"
        />
        <Text
          id="text4"
          value="Purpose: clarify what the business case should not assume."
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <TextInput
          id="explicitOutOfScopeInput"
          label="Explicit out of scope"
          labelPosition="top"
          placeholder="List anything deliberately excluded from this initiative."
        />
        <TextInput
          id="knownDependenciesInput"
          label="Known dependencies"
          labelPosition="top"
          placeholder="List teams, decisions, systems, suppliers, approvals or activities this work depends on."
        />
      </View>
    </Container>
    <Spacer id="spacer9" />
    <Container
      id="container9"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitle3"
          value="#### Planning Assumptions & Constraints"
          verticalAlign="center"
        />
        <Text
          id="text5"
          value="Purpose: improve assumptions, constraints, risk conversion and early warning indicators."
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <TextInput
          id="keyAssumptionsInput"
          label="Key assumptions"
          labelPosition="top"
          placeholder="List planning assumptions the business case should rely on, but which still need validation."
        />
        <TextInput
          id="keyConstraintsInput"
          label="Key constraints"
          labelPosition="top"
          placeholder="List known limits, deadlines, policies, capacity issues, technology constraints or governance constraints."
        />
      </View>
    </Container>
    <Spacer id="spacer10" />
    <Include src="./container10.rsx" />
    <Spacer id="spacer11" />
    <Include src="./container11.rsx" />
  </View>
  <View id="00031" label="Dimensions & Scope" viewKey="Step 2">
    <Include src="./containerScopeDimensions.rsx" />
  </View>
  <View
    id="5468f"
    disabled={false}
    hidden={false}
    iconPosition="left"
    label="Review & Confirm"
    viewKey="Step 4"
  >
    <Text
      id="textReviewHelp"
      value="**Review & confirm**

Review the information below before generating the charter. Confirm it is complete, accurate, and ready for final output. Optional blank fields are omitted."
      verticalAlign="center"
    />
    <Container
      id="containerReviewExecSummary"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitleReviewExecTitle"
          margin="0px"
          value="#### Executive Summary"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <KeyValue
          id="bodyExecutiveSummaryText"
          data="{{ wizardReviewModel.data?.highlights || {} }}"
          enableSaveActions={true}
          itemLabelPosition="top"
          labelWrap={true}
        />
      </View>
    </Container>
    <Container
      id="containerReviewOverview"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitleReviewOverview"
          margin="0px"
          value="#### Overview"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <KeyValue
          id="bodyOverviewText"
          data="{{ wizardReviewModel.data?.overview || {} }}"
          enableSaveActions={true}
          itemLabelPosition="top"
          labelWrap={true}
        />
      </View>
    </Container>
    <Container
      id="container12"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitle6"
          margin="0px"
          value="#### Business Case Detail"
          verticalAlign="center"
        />
        <Text
          id="text8"
          value="Additional information used to strengthen scope, assumptions, constraints, dependencies, resources, budget and assurance content in the generated business case."
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <KeyValue
          id="keyValueBusinessCaseDetail"
          data="{{ wizardReviewModel.data?.businessCaseDetail || {} }}"
          enableSaveActions={true}
          itemLabelPosition="top"
          labelWrap={true}
        />
      </View>
    </Container>
    <Container
      id="containerReviewDimensionsAndScope"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitleReviewDimensionsAndScope"
          margin="0px"
          value="#### Dimensions & Scope"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <KeyValue
          id="bodyDimensionsAndScopeText"
          data="{{ wizardReviewModel.data?.dimensions || {} }}"
          enableSaveActions={true}
          itemLabelPosition="top"
          labelWrap={true}
        />
      </View>
    </Container>
    <Container
      id="containerReviewContextAndSystems"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitleReviewContextAndSystems"
          margin="0px"
          value="#### Context & Systems"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <KeyValue
          id="bodyContextAndSystemsText"
          data="{{ wizardReviewModel.data?.contextSystems || {} }}"
          enableSaveActions={true}
          itemLabelPosition="top"
          labelWrap={true}
        />
      </View>
    </Container>
    <Container
      id="containerReviewDeliveryGovernanceApproach"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerDeliveryGovernanceApproachTitle"
          margin="0px"
          value="#### Delivery method / governance approach"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="bodyDeliveryGovernenceApproachText"
          value="{{ deliveryModelGroupSelect.selectedItem?.label || 'Not provided' }}"
          verticalAlign="center"
        />
      </View>
    </Container>
    <Container
      id="containerPreferredDeliveryModel"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="cotainerPreferredDeliveryModelTitle"
          margin="0px"
          value="#### Preferred framework / method"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="bodyPreferredDeliveryModelText"
          value="{{ preferredDeliveryModelSelect.selectedItem?.label || 'Not provided' }}"
          verticalAlign="center"
        />
      </View>
    </Container>
    <Container
      id="containerCustomDeliveryModel"
      footerPadding="6px 10px"
      headerPadding="6px 10px"
      hidden="{{ preferredDeliveryModelSelect.selectedItem?.model_code !== 'CUSTOM' }}"
      margin="8px 0px"
      padding="10px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerCustomDeliveryModelTitle"
          margin="0px"
          value="#### Custom framework / method"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="bodyCustomDeliveryModelText"
          value="{{ deliveryModelCustomInput.value || 'Not provided' }}"
          verticalAlign="center"
        />
      </View>
    </Container>
  </View>
  <Footer>
    <Button
      id="buttonCancel"
      iconAfter="bold/interface-content-fire-alternate"
      iconBefore="bold/interface-content-fire-alternate"
      style={{
        hoverBackground: "#b5bcc6",
        label: "canvas",
        activeBackground: "#c7ccd4",
        icon: "danger",
      }}
      text="Cancel"
    >
      <Event
        id="3276a1cf"
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
    <Button
      id="prevButton"
      disabled="{{ steppedContainerHomepage.currentViewIndex === 0 || runGenerateFlow.isFetching }}"
      iconBefore="bold/interface-arrows-left-alternate"
      styleVariant="outline"
      text="Previous"
    >
      <Event
        id="f688e67c"
        event="click"
        method="showPreviousVisibleView"
        params={{ map: { wrap: false } }}
        pluginId="steppedContainerHomepage"
        type="widget"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button
      id="nextButton"
      disabled="{{
  (() => {
    const isBlank = (v) =>
      v === null ||
      v === undefined ||
      v === '' ||
      (typeof v === 'string' && v.trim() === '') ||
      (Array.isArray(v) && v.length === 0);

    const currentStep = steppedContainerHomepage.currentViewIndex;

    const start = initiativeTargetStartDate.value
      ? new Date(initiativeTargetStartDate.value)
      : null;

    const end = initiativeTargetEndDate.value
      ? new Date(initiativeTargetEndDate.value)
      : null;

    const datesInvalid = (() => {
      if (!start || !end) return true;

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const minEnd = new Date(start);
      minEnd.setMonth(minEnd.getMonth() + 1);

      return end < minEnd;
    })();

    const overviewInvalid =
      isBlank(initiativeName.value) ||
      isBlank(initiativeDescription.value) ||
      isBlank(initiativeBudget.value) ||
      isBlank(initiativeTargetStartDate.value) ||
      isBlank(initiativeTargetEndDate.value) ||
      isBlank(initiativeServiceIndustrySelect.value) ||
      datesInvalid;

    const selected =
      Array.isArray(systemsSelectionState.value) ? systemsSelectionState.value : [];

    const noSystemsSelected = selected.length === 0;

    const othersInvalid =
      selected.some(r => r.systemId === null && isBlank(r.customSystemName));

    const bucketsInvalid =
      selected.some(r => isBlank(r.impactBucketCode));

    const contextSystemsInvalid =
      isBlank(textInputBusinessProblem.value) ||
      isBlank(textInputStrategicObjectives.value) ||
      noSystemsSelected ||
      othersInvalid ||
      bucketsInvalid;

    const businessCaseDetailInvalid = false;

    const dimensionsInvalid =
      isBlank(radioGroupScale.value) ||
      isBlank(radioGroupComplexity.value) ||
      isBlank(radioGroupReadiness.value) ||
      isBlank(multiselectBusinessDrivers.value) ||
      isBlank(multiselectImpactedFunctions.value) ||
      isBlank(selectLifeCycleStage.value) ||
      isBlank(checkboxGroupPOTIProcesses.value) ||
      isBlank(checkboxGroupPOTIOrganisation.value) ||
      isBlank(checkboxGroupPOTITechnology.value) ||
      isBlank(checkboxGroupPOTIInformation.value);

    if (runGenerateFlow.isFetching) return true;

    if (currentStep === 0) return overviewInvalid;
    if (currentStep === 1) return contextSystemsInvalid;
    if (currentStep === 2) return businessCaseDetailInvalid;
    if (currentStep === 3) return dimensionsInvalid;
    if (currentStep === 4) return true;

    return true;
  })()
}}"
      iconAfter="bold/interface-arrows-right-alternate"
      text="Next"
    >
      <Event
        id="b887258c"
        event="click"
        method="showNextVisibleView"
        params={{ map: { wrap: false } }}
        pluginId="steppedContainerHomepage"
        type="widget"
        waitMs="0"
        waitType="debounce"
      />
      <Event
        id="832e9202"
        event="click"
        method="trigger"
        params={{}}
        pluginId="wizardReviewModel"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button
      id="buttonGenerate"
      disabled="{{
  steppedContainerHomepage.currentViewIndex !== 4
  || runGenerateFlow.isFetching
  || (() => {
    const isBlank = (v) =>
      v === null ||
      v === undefined ||
      v === '' ||
      (typeof v === 'string' && v.trim() === '') ||
      (Array.isArray(v) && v.length === 0);

    const start = initiativeTargetStartDate.value
      ? new Date(initiativeTargetStartDate.value)
      : null;

    const end = initiativeTargetEndDate.value
      ? new Date(initiativeTargetEndDate.value)
      : null;

    const datesInvalid = (() => {
      if (!start || !end) return true;

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const minEnd = new Date(start);
      minEnd.setMonth(minEnd.getMonth() + 1);

      return end < minEnd;
    })();

    return (
      isBlank(initiativeName.value) ||
      isBlank(initiativeDescription.value) ||
      isBlank(initiativeBudget.value) ||
      isBlank(initiativeTargetStartDate.value) ||
      isBlank(initiativeTargetEndDate.value) ||
      isBlank(initiativeServiceIndustrySelect.value) ||

      isBlank(radioGroupScale.value) ||
      isBlank(radioGroupComplexity.value) ||
      isBlank(radioGroupReadiness.value) ||
      isBlank(multiselectBusinessDrivers.value) ||
      isBlank(multiselectImpactedFunctions.value) ||
      isBlank(selectLifeCycleStage.value) ||
      isBlank(checkboxGroupPOTIProcesses.value) ||
      isBlank(checkboxGroupPOTIOrganisation.value) ||
      isBlank(checkboxGroupPOTITechnology.value) ||
      isBlank(checkboxGroupPOTIInformation.value) ||

      isBlank(textInputBusinessProblem.value) ||
      isBlank(textInputStrategicObjectives.value) ||
      isBlank(checkboxSystemTypes.value) ||

      datesInvalid
    );
  })()
}}"
      hidden=""
      iconBefore="bold/image-flash-2-alternate"
      style={{
        background: "warning",
        hoverBackground: "#d6aa47",
        label: "canvas",
        border: "rgba(214, 170, 71, 0)",
      }}
      text="Generate"
    >
      <Event
        id="08a0066e"
        event="click"
        method="trigger"
        params={{}}
        pluginId="runGenerateFlow"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
  </Footer>
</Container>
