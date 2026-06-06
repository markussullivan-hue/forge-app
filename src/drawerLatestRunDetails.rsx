<DrawerFrame
  id="drawerLatestRunDetails"
  footerPadding="8px 12px"
  headerPadding="8px 12px"
  hidden={true}
  hideOnEscape={true}
  isHiddenOnMobile={true}
  overlayInteraction={true}
  padding="8px 12px"
  showFooter={true}
  showHeader={true}
  showOverlay={true}
  width="large"
>
  <Header>
    <Text
      id="latestRunDetailsTitle"
      value="#### Latest generation run"
      verticalAlign="center"
    />
  </Header>
  <Body>
    <Text
      id="runDetailsStatusText"
      value="**Status:** {{ latestRunForSelectedProject.data?.status || 'No run found' }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsCurrentStageText"
      value="**Current stage:** {{ latestRunForSelectedProject.data?.current_stage || '—' }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsCompletedStagesText"
      value="**Completed stages:** {{ (() => {
  const v = latestRunForSelectedProject.data?.stages_completed;
  if (Array.isArray(v) && v.length) {
    return v.map(x => String(x)).filter(Boolean).join(' → ');
  }
  if (typeof v === 'string' && v.trim() !== '') {
    // If backend ever returns a comma-separated string, normalize to arrows.
    return v.split(',').map(s => s.trim()).filter(Boolean).join(' → ');
  }
  return '—';
})() }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsStartedAtText"
      value="**Started at:** {{ (() => {
  const v = latestRunForSelectedProject.data?.started_at;
  if (!v) return '—';
  const m = moment(v);
  return m.isValid() ? m.local().format('DD MMM YYYY, HH:mm') : '—';
})() }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsCompletedAtText"
      value="**Completed at:** {{ (() => {
  const v = latestRunForSelectedProject.data?.completed_at;
  if (!v) return '—';
  const m = moment(v);
  return m.isValid() ? m.local().format('DD MMM YYYY, HH:mm') : '—';
})() }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsUpdatedAtText"
      value="**Updated at:** {{ (() => {
  const v = latestRunForSelectedProject.data?.updated_at;
  if (!v) return '—';
  const m = moment(v);
  return m.isValid() ? m.local().format('DD MMM YYYY, HH:mm') : '—';
})() }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsDurationText"
      value="**Duration:** {{ (() => {
  const ms = latestRunForSelectedProject.data?.total_duration_ms;
  if (ms === null || ms === undefined || ms === '') return '—';
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) return '—';
  const totalSeconds = Math.round(n / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs}s`;
})() }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsInitiatedByText"
      value="**Initiated by:** {{ latestRunForSelectedProject.data?.initiated_by_email || '—' }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsRunIdText"
      value="**Run ID:** {{ latestRunForSelectedProject.data?.run_id || '—' }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsWorkflowRunIdText"
      value="**Workflow run ID:** {{ latestRunForSelectedProject.data?.workflow_run_id || '—' }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsCorrelationIdText"
      value="**Correlation ID:** {{ latestRunForSelectedProject.data?.correlation_id || '—' }}"
      verticalAlign="center"
    />
    <Text
      id="runDetailsErrorMessageText"
      value="**Error message:**

{{ (() => {
  const msg = latestRunForSelectedProject.data?.error_message || 'No error recorded.';
  const safe = String(msg);
  return `\n\n\`\`\`\n${safe}\n\`\`\``;
})() }}"
      verticalAlign="center"
    />
  </Body>
  <Footer>
    <Button id="btnCloseRunDetails" text="Close">
      <Event
        id="2dd666f2"
        event="click"
        method="run"
        params={{ map: { src: "drawerLatestRunDetails.hide();" } }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
  </Footer>
</DrawerFrame>
