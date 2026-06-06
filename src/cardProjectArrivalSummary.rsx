<Container
  id="cardProjectArrivalSummary"
  footerPadding="4px 12px"
  headerPadding="6px 10px"
  margin="8px 0px 8px 0px"
  padding="6px 10px"
  showHeader={true}
  style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
>
  <Header>
    <Text
      id="arrivalSummaryProjectText"
      margin="0px"
      value="**Project:** {{ projectSelect.selectedLabel || (() => {
  const rows = formatDataAsArray(getProjectsForSelector.data || []);
  const id = selectedProjectIdState.value;
  const row = rows.find(r => String(r?.project_id || '') === String(id || ''));
  if (!id) return 'No project selected';
  if (row) {
    const name = (row.project_name && String(row.project_name).trim() !== '' ? row.project_name : '[Unnamed project]');
    const code = row.project_code ? ` | ${row.project_code}` : '';
    return `${name}${code}`;
  }
  return `Selected project: ${id}`;
})() }}"
      verticalAlign="center"
    />
    <Text
      id="arrivalSummaryLatestRunText"
      margin="0px"
      value="**Latest run:** {{ latestRunForSelectedProject.data?.status || 'No generation run found' }}"
      verticalAlign="center"
    />
    <Text
      id="arrivalSummaryStageText"
      margin="0px"
      value="**Stage:** {{ latestRunForSelectedProject.data?.current_stage || '—' }}"
      verticalAlign="center"
    />
    <Text
      id="arrivalSummaryArtefactsText"
      margin="0px"
      value="**Current artefacts:** {{ Object.keys(artefactMap.data || {}).filter(k => k !== 'pdf').length }}"
      verticalAlign="center"
    />
    <Text
      id="arrivalSummaryPdfText"
      margin="0px"
      value="**PDF:** {{ artefactMap.data?.pdf?.additional_metadata_json?.pdfmonkey_preview_url ? 'Available' : 'Not available' }}"
      verticalAlign="center"
    />
    <Button
      id="btnViewRunDetails"
      disabled="{{ !latestRunForSelectedProject.data }}"
      iconBefore="bold/interface-search"
      styleVariant="outline"
      text="View run details"
      tooltipText="{{ latestRunForSelectedProject.data ? 'View details for the latest generation run.' : 'No generation run found for this project.' }}"
    >
      <Event
        id="f17cbc54"
        event="click"
        method="run"
        params={{ map: { src: "drawerLatestRunDetails.show();" } }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
  </Header>
  <View id="00030" viewKey="View 1" />
</Container>
