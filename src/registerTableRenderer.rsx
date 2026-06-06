<Container
  id="registerTableRenderer"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  hidden="{{ activeArtefact.data?.pattern !== 'register_table' }}"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Text
      id="s1Heading"
      value="### 1. How FORGE Logic™  built this pack"
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <Text
      id="s1Intro"
      disableMarkdown={true}
      value="{{ activeArtefact.data?.section_1?.intro || '' }}"
      verticalAlign="center"
    />
    <Table
      id="s1Table"
      cellSelection="none"
      clearChangesetOnSave={true}
      data="{{ activeArtefact.data?.section_1?.rows || [] }}"
      defaultSelectedRow={{ mode: "index", indexType: "display", index: 0 }}
      dynamicRowHeights={true}
      emptyMessage="No rows found"
      enableSaveActions={true}
      primaryKeyColumnId="571ed"
      rowHeight="small"
      rowSelection="multiple"
      showBorder={true}
      showFooter={true}
      showHeader={true}
      toolbarPosition="bottom"
    >
      <Column
        id="571ed"
        alignment="left"
        editable={false}
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="artefact_name"
        label="Artefact name"
        placeholder="Enter value"
        position="center"
        size={253.4375}
        summaryAggregationMode="none"
      />
      <Column
        id="5c673"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="rationale"
        label="Rationale"
        placeholder="Enter value"
        position="center"
        size={577.671875}
        summaryAggregationMode="none"
      />
      <Column
        id="65d9d"
        alignment="left"
        format="tag"
        formatOptions={{ automaticColors: true }}
        groupAggregationMode="none"
        key="evidence_strength"
        label="Evidence strength"
        placeholder="Select option"
        position="center"
        size={118.921875}
        summaryAggregationMode="none"
        valueOverride="{{ _.startCase(item) }}"
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
          id="8d1ccef0"
          event="clickToolbar"
          method="exportData"
          pluginId="s1Table"
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
          id="abb06028"
          event="clickToolbar"
          method="refresh"
          pluginId="s1Table"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
    </Table>
    <Text
      id="s2Heading"
      value="### 2. What FORGE Logic™  inferred or assumed"
      verticalAlign="center"
    />
    <Text
      id="s2Intro"
      value="{{ activeArtefact.data?.section_2?.intro || '' }}"
      verticalAlign="center"
    />
    <Table
      id="s2Table"
      cellSelection="none"
      clearChangesetOnSave={true}
      data="{{ activeArtefact.data?.section_2?.rows || [] }}"
      defaultSelectedRow={{ mode: "index", indexType: "display", index: 0 }}
      dynamicRowHeights={true}
      emptyMessage="No rows found"
      enableSaveActions={true}
      primaryKeyColumnId="77b04"
      rowHeight="small"
      rowSelection="multiple"
      showBorder={true}
      showFooter={true}
      showHeader={true}
      style={{ border: "surfacePrimary" }}
      toolbarPosition="bottom"
    >
      <Column
        id="77b04"
        alignment="left"
        editable={false}
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="claim"
        label="Claim"
        placeholder="Enter value"
        position="center"
        size={405.0625}
        summaryAggregationMode="none"
      />
      <Column
        id="ea78c"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="location"
        label="Location"
        placeholder="Enter value"
        position="center"
        size={234.90625}
        summaryAggregationMode="none"
      />
      <Column
        id="e6c07"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="inference_source"
        label="Inference source"
        placeholder="Enter value"
        position="center"
        size={227.671875}
        summaryAggregationMode="none"
        valueOverride="{{ (item || '').trim() === 'From the methodology' && activeArtefact.data?.model_name
     ? `From the ${activeArtefact.data.model_name} methodology`
     : item }}"
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
          id="ca7fc1db"
          event="clickToolbar"
          method="exportData"
          pluginId="s2Table"
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
          id="7fc9b116"
          event="clickToolbar"
          method="refresh"
          pluginId="s2Table"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
    </Table>
    <Text
      id="s3Heading"
      value="### 3. FORGE Logic™  recommendations for next pass enhancement"
      verticalAlign="center"
    />
    <Text
      id="s3Intro"
      value="{{ activeArtefact.data?.section_3?.intro || '' }}"
      verticalAlign="center"
    />
    <Table
      id="s3Table"
      cellSelection="none"
      clearChangesetOnSave={true}
      data="{{ activeArtefact.data?.section_3?.rows || [] }}"
      defaultSelectedRow={{ mode: "index", indexType: "display", index: 0 }}
      dynamicRowHeights={true}
      emptyMessage="No rows found"
      enableSaveActions={true}
      primaryKeyColumnId="cd359"
      rowHeight="small"
      rowSelection="multiple"
      showBorder={true}
      showFooter={true}
      showHeader={true}
      toolbarPosition="bottom"
    >
      <Column
        id="cd359"
        alignment="left"
        editable={false}
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="input_field"
        label="Input field"
        placeholder="Enter value"
        position="center"
        size={155.484375}
        summaryAggregationMode="none"
      />
      <Column
        id="140d1"
        alignment="left"
        format="tag"
        formatOptions={{ automaticColors: true }}
        groupAggregationMode="none"
        key="what_was_supplied"
        label="What was supplied"
        placeholder="Select option"
        position="center"
        size={127.015625}
        summaryAggregationMode="none"
        valueOverride="{{ _.startCase(item) }}"
      />
      <Column
        id="390dd"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="how_it_shapes_output"
        label="How it shapes output"
        placeholder="Enter value"
        position="center"
        size={306.75}
        summaryAggregationMode="none"
      />
      <Column
        id="90515"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="what_would_strengthen"
        label="What would strengthen it"
        placeholder="Enter value"
        position="center"
        size={335.5625}
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
          id="c27b34ca"
          event="clickToolbar"
          method="exportData"
          pluginId="s3Table"
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
          id="44ce8604"
          event="clickToolbar"
          method="refresh"
          pluginId="s3Table"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
    </Table>
  </View>
</Container>
