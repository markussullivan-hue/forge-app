<Container
  id="container13"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
>
  <View id="00030" viewKey="View 1">
    <Table
      id="tableObservations"
      cellSelection="none"
      clearChangesetOnSave={true}
      data="{{ getCurrentObservationsForEntity.data?.content_metadata?.[0]?.section_1?.rows || [] }}"
      defaultSelectedRow={{ mode: "index", indexType: "display", index: 0 }}
      emptyMessage="No rows found"
      enableSaveActions={true}
      rowHeight="medium"
      showBorder={true}
      showFooter={true}
      showHeader={true}
      toolbarPosition="bottom"
    >
      <Column
        id="116d4"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="rationale"
        label="Rationale"
        placeholder="Enter value"
        position="center"
        size={602.71875}
        summaryAggregationMode="none"
      />
      <Column
        id="c703f"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="artefact_name"
        label="Artefact name"
        placeholder="Enter value"
        position="center"
        size={157.4375}
        summaryAggregationMode="none"
      />
      <Column
        id="77265"
        alignment="center"
        format="tag"
        formatOptions={{
          automaticColors: false,
          color:
            '{{ ({Strong: "#009767", Reasonable: "#4C1799", Thin: "#F8772B", Insufficient: "#E40436"})[item] }}',
        }}
        groupAggregationMode="none"
        key="evidence_strength"
        label="Evidence strength"
        placeholder="Select option"
        position="center"
        size={118.921875}
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
          id="dc20ff21"
          event="clickToolbar"
          method="exportData"
          pluginId="tableObservations"
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
          id="9b1ba06f"
          event="clickToolbar"
          method="refresh"
          pluginId="tableObservations"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
    </Table>
    <Text
      id="observationsSection2Intro"
      value="{{ getCurrentObservationsForEntity.data?.content_metadata?.[0]?.section_2?.intro || '' }}"
      verticalAlign="center"
    />
    <Table
      id="observationsSection2Table"
      cellSelection="none"
      clearChangesetOnSave={true}
      data="{{ getCurrentObservationsForEntity.data?.content_metadata?.[0]?.section_2?.rows || [] }}"
      defaultSelectedRow={{ mode: "index", indexType: "display", index: 0 }}
      emptyMessage="No rows found"
      enableSaveActions={true}
      showBorder={true}
      showFooter={true}
      showHeader={true}
      toolbarPosition="bottom"
    >
      <Column
        id="dfce9"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="claim"
        label="Claim"
        placeholder="Enter value"
        position="center"
        size={662.828125}
        summaryAggregationMode="none"
      />
      <Column
        id="b7849"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="location"
        label="Location"
        placeholder="Enter value"
        position="center"
        size={245.875}
        summaryAggregationMode="none"
      />
      <Column
        id="fdd0a"
        alignment="left"
        format="tag"
        formatOptions={{
          automaticColors: false,
          color:
            '{{ ({\n  "From your inputs":                 "#1F8B4C",\n  "Calculated from your inputs":      "#2A9D8F",\n  "From the methodology":             "#3B6EA8",\n  "From governance reference guidance":"#7E57C2",\n  "From benchmark data":              "#E07A1F",\n  "Flagged as open":                  "#C0392B"\n})[item] }}',
        }}
        groupAggregationMode="none"
        key="inference_source"
        label="Inference source"
        placeholder="Select option"
        position="center"
        size={164.1875}
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
          id="820b9b50"
          event="clickToolbar"
          method="exportData"
          pluginId="observationsSection2Table"
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
          id="f62ce2b1"
          event="clickToolbar"
          method="refresh"
          pluginId="observationsSection2Table"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
    </Table>
    <Text
      id="text11"
      value="{{ getCurrentObservationsForEntity.data?.content_metadata?.[0]?.section_3?.intro || '' }}"
      verticalAlign="center"
    />
    <Table
      id="table1"
      cellSelection="none"
      clearChangesetOnSave={true}
      data="{{ getCurrentObservationsForEntity.data?.content_metadata?.[0]?.section_3?.rows || [] }}"
      defaultSelectedRow={{ mode: "index", indexType: "display", index: 0 }}
      emptyMessage="No rows found"
      enableSaveActions={true}
      showBorder={true}
      showFooter={true}
      showHeader={true}
      toolbarPosition="bottom"
    >
      <Column
        id="bdc38"
        alignment="left"
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
        id="4fbf5"
        alignment="left"
        format="tag"
        formatOptions={{ automaticColors: true }}
        groupAggregationMode="none"
        key="what_was_supplied"
        label="What was supplied"
        placeholder="Select option"
        position="center"
        size={123.015625}
        summaryAggregationMode="none"
        valueOverride="{{ _.startCase(item) }}"
      />
      <Column
        id="cf7e9"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="how_it_shapes_output"
        label="How it shapes output"
        placeholder="Enter value"
        position="center"
        size={474.0625}
        summaryAggregationMode="none"
      />
      <Column
        id="fb15f"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="what_would_strengthen"
        label="What would strengthen"
        placeholder="Enter value"
        position="center"
        size={583.140625}
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
          id="d875a305"
          event="clickToolbar"
          method="exportData"
          pluginId="table1"
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
          id="794aa9b0"
          event="clickToolbar"
          method="refresh"
          pluginId="table1"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
    </Table>
  </View>
</Container>
