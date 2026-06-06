<Screen
  id="dashboardPage"
  _customShortcuts={[]}
  _hashParams={[]}
  _order={2}
  _searchParams={[]}
  browserTitle="Dashboard"
  title="Dashboard"
  urlSlug="dashboard"
  uuid="24d2c638-2051-42ae-ad94-65d54866c7ce"
>
  <SqlQueryUnified
    id="getDashboardKpis"
    notificationDuration={4.5}
    query={include("../lib/getDashboardKpis.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getContinueWorkingProjects"
    notificationDuration={4.5}
    query={include("../lib/getContinueWorkingProjects.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getRecentGenerationRuns"
    notificationDuration={4.5}
    query={include("../lib/getRecentGenerationRuns.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
  />
  <SqlQueryUnified
    id="getDecisionsNeeded"
    notificationDuration={4.5}
    query={include("../lib/getDecisionsNeeded.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <SqlQueryUnified
    id="getRisksAssuranceItems"
    notificationDuration={4.5}
    query={include("../lib/getRisksAssuranceItems.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
  />
  <JavascriptQuery
    id="sessionGuard"
    notificationDuration={4.5}
    query={include("../lib/sessionGuard.js", "string")}
    resourceName="JavascriptQuery"
    runWhenPageLoads={true}
    showSuccessToaster={false}
  >
    <Event
      id="f2384fb0"
      event="failure"
      method="openPage"
      params={{
        options: { map: { passDataWith: "urlParams" } },
        pageName: "loginPage",
      }}
      pluginId=""
      type="util"
      waitMs="0"
      waitType="debounce"
    />
  </JavascriptQuery>
  <SqlQueryUnified
    id="getContinueWorkingProjects2"
    notificationDuration={4.5}
    query={include("../lib/getContinueWorkingProjects2.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showSuccessToaster={false}
    warningCodes={[]}
  />
  <Frame
    id="$main3"
    enableFullBleed={false}
    isHiddenOnDesktop={false}
    isHiddenOnMobile={false}
    padding="8px 12px"
    sticky={null}
    type="main"
  >
    <Image
      id="image5"
      heightType="fixed"
      horizontalAlign="center"
      retoolStorageFileId="2939f030-8450-435d-9363-ccd927bb0387"
      src="https://picsum.photos/id/1025/800/600"
      srcType="retoolStorageFileId"
    />
    <Button id="logoutButton" text="Logout">
      <Event
        id="5671c532"
        event="click"
        method="run"
        params={{ map: { src: "localStorage.clear('forge_session');" } }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
      <Event
        id="92b1cae5"
        event="click"
        method="openPage"
        params={{
          options: { map: { passDataWith: "urlParams" } },
          pageName: "loginPage",
        }}
        pluginId=""
        type="util"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button id="btnNewProject" allowWrap={false} text="New Project" />
    <Button
      id="btnGenerateArtefacts"
      allowWrap={false}
      styleVariant="outline"
      text="Generate Artefacts"
    >
      <Event
        id="c1dc5a5c"
        event="click"
        method="run"
        params={{
          map: {
            src: "const projectId = selectedProjectIdState.value;\n\nif (!projectId) {\n  utils.showNotification({\n    title: 'Select a project first',\n    description: 'Open a project from Continue Working before generating artefacts.',\n    notificationType: 'warning'\n  });\n  return;\n}\n\nutils.openPage('CharterGenerationPage', {\n  passDataWith: 'urlParams'\n});",
          },
        }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Text
      id="dashboardSubtitleText"
      value="#### Project intelligence, governance status, and delivery readiness."
      verticalAlign="center"
    />
    <Container
      id="cardActiveProjects"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Statistic
          id="statActiveProjects"
          currency="USD"
          decimalPlaces={0}
          label="Active Projects"
          positiveTrend="{{ self.value >= 0 }}"
          secondaryCurrency="USD"
          secondaryFormattingStyle="percent"
          secondaryPositiveTrend="{{ self.secondaryValue >= 0 }}"
          secondaryShowSeparators={true}
          secondarySignDisplay="trendArrows"
          secondaryValue=""
          showSeparators={true}
          value="{{ getDashboardKpis.data?.active_projects?.[0] ?? 0 }}"
        />
      </View>
    </Container>
    <Container
      id="cardProjectsRequiringDecision"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Statistic
          id="statProjectsRequiringDecision"
          currency="USD"
          decimalPlaces={0}
          label="Projects Requiring Decision"
          positiveTrend="{{ self.value >= 0 }}"
          secondaryCurrency="USD"
          secondaryFormattingStyle="percent"
          secondaryPositiveTrend="{{ self.secondaryValue >= 0 }}"
          secondaryShowSeparators={true}
          secondarySignDisplay="trendArrows"
          secondaryValue=""
          showSeparators={true}
          value="{{ getDashboardKpis.data?.projects_requiring_decision?.[0] ?? 0 }}"
        />
      </View>
    </Container>
    <Container
      id="cardArtefactsGenerated"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Statistic
          id="statArtefactsGenerated"
          currency="USD"
          decimalPlaces={0}
          label="Artefacts Generated"
          positiveTrend="{{ self.value >= 0 }}"
          secondaryCurrency="USD"
          secondaryFormattingStyle="percent"
          secondaryPositiveTrend="{{ self.secondaryValue >= 0 }}"
          secondaryShowSeparators={true}
          secondarySignDisplay="trendArrows"
          secondaryValue=""
          showSeparators={true}
          value="{{ getDashboardKpis.data?.artefacts_generated?.[0] ?? 0 }}"
        />
      </View>
    </Container>
    <Container
      id="cardOpenRisks"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Statistic
          id="statOpenRisks"
          currency="USD"
          decimalPlaces={0}
          label="Open Risks"
          positiveTrend="{{ self.value >= 0 }}"
          secondaryCurrency="USD"
          secondaryFormattingStyle="percent"
          secondaryPositiveTrend="{{ self.secondaryValue >= 0 }}"
          secondaryShowSeparators={true}
          secondarySignDisplay="trendArrows"
          secondaryValue=""
          showSeparators={true}
          value="{{ getDashboardKpis.data?.open_risks?.[0] ?? 0 }}"
        />
      </View>
    </Container>
    <Container
      id="cardRunsCompleted"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Statistic
          id="statRunsCompleted"
          currency="USD"
          decimalPlaces={0}
          label="Runs Completed"
          positiveTrend="{{ self.value >= 0 }}"
          secondaryCurrency="USD"
          secondaryFormattingStyle="percent"
          secondaryPositiveTrend="{{ self.secondaryValue >= 0 }}"
          secondaryShowSeparators={true}
          secondarySignDisplay="trendArrows"
          secondaryValue=""
          showSeparators={true}
          value="{{ getDashboardKpis.data?.runs_completed?.[0] ?? 0 }}"
        />
      </View>
    </Container>
    <Container
      id="cardItemsNeedingReview"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Statistic
          id="statItemsNeedingReview"
          currency="USD"
          decimalPlaces={0}
          label="Items Needing Review"
          positiveTrend="{{ self.value >= 0 }}"
          secondaryCurrency="USD"
          secondaryFormattingStyle="percent"
          secondaryPositiveTrend="{{ self.secondaryValue >= 0 }}"
          secondaryShowSeparators={true}
          secondarySignDisplay="trendArrows"
          secondaryValue=""
          showSeparators={true}
          value="{{ getDashboardKpis.data?.items_needing_review?.[0] ?? 0 }}"
        />
      </View>
    </Container>
    <Container
      id="cardRecentGenerationRuns"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Text
          id="recentGenerationRunsTitle"
          value="#### Recent Generation Runs"
          verticalAlign="center"
        />
        <Table
          id="tableRecentGenerationRuns"
          cellSelection="none"
          clearChangesetOnSave={true}
          data="{{ formatDataAsArray(getRecentGenerationRuns.data || []) }}"
          defaultSelectedRow={{ mode: "none", indexType: "display", index: 0 }}
          emptyMessage="No recent generation runs found."
          enableSaveActions={true}
          primaryKeyColumnId="e446a"
          rowHeight="medium"
          rowSelection="none"
          searchMode="disabled"
          showBorder={true}
          showFooter={true}
          showHeader={true}
          style={{ rowSeparator: "surfacePrimaryBorder" }}
          toolbarPosition="bottom"
        >
          <Column
            id="4e4e0"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="project_name"
            label="Project"
            position="center"
            referenceId="colProject"
            size={200}
            summaryAggregationMode="none"
          />
          <Column
            id="326fc"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="run_status"
            label="Run Status"
            position="center"
            referenceId="colRunStatus"
            size={140}
            summaryAggregationMode="none"
          />
          <Column
            id="a85c8"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="current_stage"
            label="Current Stage"
            position="center"
            referenceId="colCurrentStage"
            size={160}
            summaryAggregationMode="none"
          />
          <Column
            id="4ec8f"
            alignment="left"
            format="datetime"
            groupAggregationMode="none"
            hidden="false"
            key="completed_at"
            label="Completed At"
            position="center"
            referenceId="colCompletedAt"
            size={170}
            summaryAggregationMode="none"
          />
          <Column
            id="f1194"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="action_label"
            label="Action"
            position="center"
            referenceId="colAction"
            size={120}
            summaryAggregationMode="none"
          />
          <ToolbarButton
            id="1a"
            icon="bold/interface-text-formatting-filter-2"
            label="Filter"
            type="filter"
          />
          <ToolbarButton
            id="3c"
            icon="bold/interface-download-button-2"
            label="Download"
            type="custom"
          >
            <Event
              id="c2fa1a2d"
              event="clickToolbar"
              method="exportData"
              pluginId="tableRecentGenerationRuns"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
          <ToolbarButton
            id="4d"
            icon="bold/interface-arrows-round-left"
            label="Refresh"
            type="custom"
          >
            <Event
              id="b4a3d1fd"
              event="clickToolbar"
              method="refresh"
              pluginId="tableRecentGenerationRuns"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
        </Table>
      </View>
    </Container>
    <Container
      id="cardContinueWorking"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Text
          id="continueWorkingTitle"
          value="#### Continue Working"
          verticalAlign="center"
        />
        <Table
          id="tableContinueWorking"
          cellSelection="none"
          clearChangesetOnSave={true}
          data="{{ formatDataAsArray(getContinueWorkingProjects.data || []) }}"
          defaultSelectedRow={{ mode: "none", indexType: "display", index: 0 }}
          emptyMessage="No active projects found."
          enableSaveActions={true}
          primaryKeyColumnId="e78e8"
          rowHeight="medium"
          searchMode="disabled"
          showBorder={true}
          showFooter={true}
          showHeader={true}
          style={{ rowSeparator: "surfacePrimaryBorder" }}
          toolbarPosition="bottom"
        >
          <Column
            id="4c176"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="project_name"
            label="Project"
            position="center"
            referenceId="colProject"
            size={200}
            summaryAggregationMode="none"
          />
          <Column
            id="53639"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="lifecycle_stage"
            label="Stage"
            position="center"
            referenceId="colStage"
            size={120}
            summaryAggregationMode="none"
          />
          <Column
            id="f431a"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="status"
            label="Status"
            position="center"
            referenceId="colStatus"
            size={140}
            summaryAggregationMode="none"
          />
          <Column
            id="b437c"
            alignment="left"
            format="datetime"
            groupAggregationMode="none"
            hidden="false"
            key="last_updated_at"
            label="Last Updated"
            position="center"
            referenceId="colLastUpdated"
            size={160}
            summaryAggregationMode="none"
          />
          <Column
            id="089e7"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="action_label"
            label="Action"
            position="center"
            referenceId="colAction"
            size={120}
            summaryAggregationMode="none"
          />
          <ToolbarButton
            id="1a"
            icon="bold/interface-text-formatting-filter-2"
            label="Filter"
            type="filter"
          />
          <ToolbarButton
            id="3c"
            icon="bold/interface-download-button-2"
            label="Download"
            type="custom"
          >
            <Event
              id="3bcad713"
              event="clickToolbar"
              method="exportData"
              pluginId="tableContinueWorking"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
          <ToolbarButton
            id="4d"
            icon="bold/interface-arrows-round-left"
            label="Refresh"
            type="custom"
          >
            <Event
              id="1737e3ba"
              event="clickToolbar"
              method="refresh"
              pluginId="tableContinueWorking"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
          <Event
            id="38968bcd"
            event="clickRow"
            method="run"
            params={{
              map: {
                src: "const row =\n  currentSourceRow ||\n  currentRow ||\n  tableContinueWorking.selectedSourceRow ||\n  tableContinueWorking.selectedRow ||\n  null;\n\nconst projectId = row?.project_id;\n\nif (!projectId) {\n  utils.showNotification({\n    title: 'No project selected',\n    description: 'Select a project before opening it.',\n    notificationType: 'warning'\n  });\n  return;\n}\n\nawait selectedProjectIdState.setValue(projectId);\n\nutils.openPage('CharterGenerationPage', {\n  passDataWith: 'urlParams'\n});",
              },
            }}
            pluginId=""
            type="script"
            waitMs="0"
            waitType="debounce"
          />
        </Table>
      </View>
    </Container>
    <Container
      id="cardRisksAssurance"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Text
          id="risksAssuranceTitle"
          value="#### Risks & Assurance"
          verticalAlign="center"
        />
        <Table
          id="tableRisksAssurance"
          cellSelection="none"
          clearChangesetOnSave={true}
          data="{{ formatDataAsArray(getRisksAssuranceItems.data || []) }}"
          defaultSelectedRow={{ mode: "none", indexType: "display", index: 0 }}
          emptyMessage="No open risk or assurance items found."
          enableSaveActions={true}
          primaryKeyColumnId="14f6b"
          rowHeight="medium"
          rowSelection="none"
          searchMode="disabled"
          showBorder={true}
          showFooter={true}
          showHeader={true}
          style={{ rowSeparator: "surfacePrimaryBorder" }}
          toolbarPosition="bottom"
        >
          <Column
            id="ed806"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="project_name"
            label="Project"
            position="center"
            referenceId="colProject"
            size={180}
            summaryAggregationMode="none"
          />
          <Column
            id="41922"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="risk_or_assurance_item"
            label="Risk / Assurance Item"
            position="center"
            referenceId="colRiskAssuranceItem"
            size={280}
            summaryAggregationMode="none"
          />
          <Column
            id="f89c9"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="severity"
            label="Severity"
            position="center"
            referenceId="colSeverity"
            size={120}
            summaryAggregationMode="none"
          />
          <Column
            id="bbc95"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="owner"
            label="Owner"
            position="center"
            referenceId="colOwner"
            size={140}
            summaryAggregationMode="none"
          />
          <Column
            id="4bd7e"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="status"
            label="Status"
            position="center"
            referenceId="colStatus"
            size={120}
            summaryAggregationMode="none"
          />
          <ToolbarButton
            id="1a"
            icon="bold/interface-text-formatting-filter-2"
            label="Filter"
            type="filter"
          />
          <ToolbarButton
            id="3c"
            icon="bold/interface-download-button-2"
            label="Download"
            type="custom"
          >
            <Event
              id="bbeb37d5"
              event="clickToolbar"
              method="exportData"
              pluginId="tableRisksAssurance"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
          <ToolbarButton
            id="4d"
            icon="bold/interface-arrows-round-left"
            label="Refresh"
            type="custom"
          >
            <Event
              id="aedb8ce8"
              event="clickToolbar"
              method="refresh"
              pluginId="tableRisksAssurance"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
        </Table>
      </View>
    </Container>
    <Container
      id="cardDecisionsNeeded"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Text
          id="decisionsNeededTitle"
          value="#### Decisions Needed"
          verticalAlign="center"
        />
        <Table
          id="tableDecisionsNeeded"
          cellSelection="none"
          clearChangesetOnSave={true}
          data="{{ formatDataAsArray(getDecisionsNeeded.data || []) }}"
          defaultSelectedRow={{ mode: "none", indexType: "display", index: 0 }}
          emptyMessage="No decisions currently require attention."
          enableSaveActions={true}
          primaryKeyColumnId="c4784"
          rowHeight="medium"
          rowSelection="none"
          searchMode="disabled"
          showBorder={true}
          showFooter={true}
          showHeader={true}
          style={{ rowSeparator: "surfacePrimaryBorder" }}
          toolbarPosition="bottom"
        >
          <Column
            id="78c6a"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="project_name"
            label="Project"
            position="center"
            referenceId="colProject"
            size={200}
            summaryAggregationMode="none"
          />
          <Column
            id="f97d0"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="decision_needed"
            label="Decision Needed"
            position="center"
            referenceId="colDecisionNeeded"
            size={260}
            summaryAggregationMode="none"
          />
          <Column
            id="249af"
            alignment="left"
            editableOptions={{ spellCheck: false }}
            format="string"
            groupAggregationMode="none"
            hidden="false"
            key="priority"
            label="Priority"
            position="center"
            referenceId="colPriority"
            size={120}
            summaryAggregationMode="none"
          />
          <Column
            id="e28f4"
            alignment="left"
            format="datetime"
            groupAggregationMode="none"
            hidden="false"
            key="due_date"
            label="Due Date"
            position="center"
            referenceId="colDueDate"
            size={140}
            summaryAggregationMode="none"
          />
          <ToolbarButton
            id="1a"
            icon="bold/interface-text-formatting-filter-2"
            label="Filter"
            type="filter"
          />
          <ToolbarButton
            id="3c"
            icon="bold/interface-download-button-2"
            label="Download"
            type="custom"
          >
            <Event
              id="4d25d8d4"
              event="clickToolbar"
              method="exportData"
              pluginId="tableDecisionsNeeded"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
          <ToolbarButton
            id="4d"
            icon="bold/interface-arrows-round-left"
            label="Refresh"
            type="custom"
          >
            <Event
              id="359dadf6"
              event="clickToolbar"
              method="refresh"
              pluginId="tableDecisionsNeeded"
              type="widget"
              waitMs="0"
              waitType="debounce"
            />
          </ToolbarButton>
        </Table>
      </View>
    </Container>
  </Frame>
</Screen>
