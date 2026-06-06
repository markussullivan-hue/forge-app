<Container
  id="tabbedContainerProjectCharter"
  currentViewKey="{{ self.viewKeys[0] }}"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Tabs
      id="charterTabsContainer"
      data="{{ orderedArtefacts.data }}"
      labels="{{ item.artefact_name }}"
      style={{}}
      targetContainerId="tabbedContainerProjectCharter"
      value="{{ self.values[0] }}"
      values="{{ item.artefact_code }}"
    >
      <Event
        id="6777653d"
        event="change"
        method="setValue"
        params={{ map: { value: "{{ self.value }}" } }}
        pluginId="selectedArtefactCodeState"
        type="state"
        waitMs="0"
        waitType="debounce"
      />
      <Event
        id="adc22095"
        event="change"
        method="trigger"
        params={{}}
        pluginId="activeArtefact"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
      <Event
        id="552496e1"
        event="change"
        method="trigger"
        params={{
          map: {
            options: {
              object: {
                onSuccess: null,
                onFailure: null,
                additionalScope: null,
              },
            },
          },
        }}
        pluginId="getActiveProjectPdf"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Tabs>
  </Header>
  <View id="00030" label="Context" viewKey="View 1">
    <Container
      id="artefactRenderer"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
    >
      <View id="00030" viewKey="View 1">
        <Text
          id="artefactRendererHeader"
          value="{{
  (() => {
    const a = activeArtefact.data;
    if (!a || !a.artefact_name) return '## Select a Project to render artefacts';

    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (iso) => {
      if (!iso) return 'Unknown time';
      const dt = new Date(iso);
      if (Number.isNaN(dt.getTime())) return 'Unknown time';
      return `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${String(dt.getFullYear()).slice(-2)} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
    };

    if (a.pattern === 'pdf_viewer') {
      const pdf = (getActiveProjectPdf.data && getActiveProjectPdf.data[0]) || {};
      const status = pdf.pdfmonkey_status ? ` | ${pdf.pdfmonkey_status}` : '';
      const filename = pdf.pdfmonkey_filename ? `  (${pdf.pdfmonkey_filename})` : '';
      return `## ${a.artefact_name}${filename}\n\n*Generated ${fmt(pdf.run_completed_at)}${status}*`;
    }

    const v = a.version_number ?? '-';
    const email = a.generated_by_email_snapshot || 'Unknown user';
    return `## ${a.artefact_name}\n\n*Version ${v} | Generated ${fmt(a.generated_at)} | by ${email}*`;
  })()
}}"
          verticalAlign="center"
        />
        <Container
          id="dynamicRegisterRenderer"
          footerPadding="4px 12px"
          headerPadding="4px 12px"
          hidden="{{ activeArtefact.data?.pattern !== 'dynamic_register' }}"
          padding="12px"
          showBody={true}
        >
          <View id="00030" viewKey="View 1">
            <Text
              id="dynamicRegisterBody"
              imageWidth="scroll"
              value="{{
  (() => {
    const a = activeArtefact.data;
    if (!a || a.pattern !== 'dynamic_register') return '';

    const cols = Array.isArray(a.columns) ? a.columns : [];
    const rows = Array.isArray(a.rows) ? a.rows : [];

    if (!cols.length) {
      return '_This register has no column definitions in its content._';
    }

    const esc = (v) =>
      String(v == null ? '' : v)
        .replace(/\|/g, '\\|')
        .replace(/\r?\n+/g, ' ')
        .trim();

    const summaryBlock = a.summary ? `${a.summary}\n\n` : '';

    const header = '| ' + cols.map((c) => esc(c.label || c.key || '')).join(' | ') + ' |';
    const sep    = '|' + cols.map(() => '---').join('|') + '|';
    const body   = rows.length
      ? rows
          .map((r) => '| ' + cols.map((c) => esc(r[c.key])).join(' | ') + ' |')
          .join('\n')
      : '| ' + cols.map(() => '_No entries_').join(' | ') + ' |';

    const footerBlock = a.footer_note ? `\n\n*${a.footer_note}*` : '';

    return summaryBlock + header + '\n' + sep + '\n' + body + footerBlock;
  })()
}}"
              verticalAlign="center"
            />
          </View>
        </Container>
        <Container
          id="narrativeRenderer"
          footerPadding="4px 12px"
          headerPadding="4px 12px"
          hidden="{{ activeArtefact.data?.pattern !== 'narrative' }}"
          padding="12px"
          showBody={true}
        >
          <View id="00030" viewKey="View 1">
            <Text
              id="narrativeBody"
              value="{{
  (() => {
    const a = activeArtefact.data;
    if (!a || a.pattern !== 'narrative') return '';

    const sections = Array.isArray(a.sections) ? a.sections : [];

    return sections.map((s) => {
      let block = `### ${s.section_title}\n\n${s.narrative || ''}`;
      if (Array.isArray(s.bullets) && s.bullets.length) {
        block += '\n\n' + s.bullets.map((b) => `- ${b}`).join('\n');
      }
      return block;
    }).join('\n\n---\n\n');
  })()
}}"
              verticalAlign="center"
            />
          </View>
        </Container>
        <Include src="./registerTableRenderer.rsx" />
      </View>
    </Container>
    <Text
      id="pdfFallback"
      hidden="{{ !!getActiveProjectPdf.data?.[0]?.pdfmonkey_preview_url }}"
      value="{{
  (() => {
    const pdf = 	getActiveProjectPdf.data && getActiveProjectPdf.data[0];
    if (!pdf) return '_No PDF has been generated for this project yet._';
    if (!pdf.pdfmonkey_preview_url) {
      const cause = pdf.pdfmonkey_failure_cause ? `\n\n*${pdf.pdfmonkey_failure_cause}*` : '';
      return `_PDF preview is not available._${cause}`;
    }
    return '';
  })()
}}"
      verticalAlign="center"
    />
  </View>
  <View id="00031" label="Charter" viewKey="View 2">
    <Container
      id="container2"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="charterTitle"
          value="### {{ artefactMap.data?.charter?.content_metadata?.title || 'Charter' }}"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="charterBody"
          margin="0px 0px 8px 0px"
          style={{
            color: "textLight",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "400",
          }}
          value="{{
  viewerStatesByType.data?.charter?.state &&
  viewerStatesByType.data?.charter?.state !== 'complete'
    ? viewerStatesByType.data?.charter?.message
    : (
        artefactMap.data?.charter?.content_markdown ||
        artefactMap.data?.charter?.content_metadata?.markdown ||
        artefactMap.data?.charter?.content_metadata?.summary ||
        'No charter artefact found.'
      )
        ?.replace(/^#\s+/gm, '### ')
        ?.replace(/^##\s+/gm, '### ')
        ?.replace(/^###\s+/gm, '#### ')
}}"
          verticalAlign="center"
        />
        <Text
          id="charterMetadata"
          margin="8px 0px 0px 0px"
          style={{
            color: "secondary",
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: "400",
          }}
          value="{{ (() => {
  const a = artefactMap.data?.charter;
  if (!a) return '';

  const dt = a.generated_at ? new Date(a.generated_at) : null;
  const pad = n => String(n).padStart(2, '0');

  const formatted =
    dt && !Number.isNaN(dt.getTime())
      ? `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${String(dt.getFullYear()).slice(-2)} - ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
      : 'Unknown time';

  const version = a.version_number ?? '-';
  const email = a.generated_by_email_snapshot || 'Unknown user';

  return `Version ${version} | Generated ${formatted} | by ${email}`;
})() }}"
          verticalAlign="center"
        />
      </View>
    </Container>
  </View>
  <View
    id="3347a"
    disabled={false}
    hidden={false}
    iconPosition="left"
    label="Observations"
    viewKey="Observations"
  >
    <Text
      id="observationsSection1Intro"
      value="### {{ getCurrentObservationsForEntity.data?.content_metadata?.[0]?.section_1?.intro || 'No observations available yet.' }}"
      verticalAlign="center"
    />
    <Include src="./container13.rsx" />
    <Text
      id="text10"
      value="👋 **Hello {{ current_user.firstName || 'friend' }}!**"
      verticalAlign="center"
    />
  </View>
  <View id="00032" label="Plan" viewKey="View 3">
    <Container
      id="container3"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="planTitle"
          value="### {{ artefactMap.data?.plan?.content_metadata?.title || 'Plan' }}"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="planBody"
          margin="0px 0px 8px 0px"
          style={{
            color: "textLight",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "400",
          }}
          value="{{
  viewerStatesByType.data?.plan?.state &&
  viewerStatesByType.data?.plan?.state !== 'complete'
    ? viewerStatesByType.data?.plan?.message
    : (
        artefactMap.data?.plan?.content_markdown ||
        artefactMap.data?.plan?.content_metadata?.markdown ||
        artefactMap.data?.plan?.content_metadata?.summary ||
        'No plan artefact found.'
      )
        ?.replace(/^#\s+/gm, '### ')
        ?.replace(/^##\s+/gm, '### ')
        ?.replace(/^###\s+/gm, '#### ')
}}"
          verticalAlign="center"
        />
        <Text
          id="planMetadata"
          margin="8px 0px 0px 0px"
          style={{
            color: "secondary",
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: "400",
          }}
          value="{{ (() => {
  const a = artefactMap.data?.plan;
  if (!a) return '';

  const dt = a.generated_at ? new Date(a.generated_at) : null;
  const pad = n => String(n).padStart(2, '0');

  const formatted =
    dt && !Number.isNaN(dt.getTime())
      ? `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${String(dt.getFullYear()).slice(-2)} - ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
      : 'Unknown time';

  const version = a.version_number ?? '-';
  const email = a.generated_by_email_snapshot || 'Unknown user';

  return `Version ${version} | Generated ${formatted} | by ${email}`;
})() }}"
          verticalAlign="center"
        />
      </View>
    </Container>
  </View>
  <View
    id="0e0db"
    disabled={false}
    hidden={false}
    iconPosition="left"
    label="Resources"
    viewKey="View 4"
  >
    <Container
      id="container4"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="resourcesTitle"
          value="### {{ artefactMap.data?.resources?.content_metadata?.title || 'Resources' }}"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="resourcesBody"
          margin="0px 0px 8px 0px"
          style={{
            color: "textLight",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "400",
          }}
          value="{{
  viewerStatesByType.data?.resources?.state &&
  viewerStatesByType.data?.resources?.state !== 'complete'
    ? viewerStatesByType.data?.resources?.message
    : (
        artefactMap.data?.resources?.content_markdown ||
        artefactMap.data?.resources?.content_metadata?.markdown ||
        artefactMap.data?.resources?.content_metadata?.summary ||
        'No resources artefact found.'
      )
        ?.replace(/^#\s+/gm, '### ')
        ?.replace(/^##\s+/gm, '### ')
        ?.replace(/^###\s+/gm, '#### ')
}}"
          verticalAlign="center"
        />
        <Text
          id="resourcesMetadata"
          margin="8px 0px 0px 0px"
          style={{
            color: "secondary",
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: "400",
          }}
          value="{{ (() => {
  const a = artefactMap.data?.resources;
  if (!a) return '';

  const dt = a.generated_at ? new Date(a.generated_at) : null;
  const pad = n => String(n).padStart(2, '0');

  const formatted =
    dt && !Number.isNaN(dt.getTime())
      ? `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${String(dt.getFullYear()).slice(-2)} - ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
      : 'Unknown time';

  const version = a.version_number ?? '-';
  const email = a.generated_by_email_snapshot || 'Unknown user';

  return `Version ${version} | Generated ${formatted} | by ${email}`;
})() }}"
          verticalAlign="center"
        />
      </View>
    </Container>
  </View>
  <View
    id="0e312"
    disabled={false}
    hidden={false}
    iconPosition="left"
    label="Risks"
    viewKey="View 5"
  >
    <Container
      id="container5"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="risksTitle"
          value="### {{ artefactMap.data?.risks?.content_metadata?.title || 'Risks' }}"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="risksBody"
          margin="0px 0px 8px 0px"
          style={{
            color: "textLight",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "400",
          }}
          value="{{
  viewerStatesByType.data?.risks?.state &&
  viewerStatesByType.data?.risks?.state !== 'complete'
    ? viewerStatesByType.data?.risks?.message
    : (
        artefactMap.data?.risks?.content_markdown ||
        artefactMap.data?.risks?.content_metadata?.markdown ||
        artefactMap.data?.risks?.content_metadata?.summary ||
        'No risks artefact found.'
      )
        ?.replace(/^#\s+/gm, '### ')
        ?.replace(/^##\s+/gm, '### ')
        ?.replace(/^###\s+/gm, '#### ')
}}"
          verticalAlign="center"
        />
        <Text
          id="risksMetadata"
          margin="8px 0px 0px 0px"
          style={{
            color: "secondary",
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: "400",
          }}
          value="{{ (() => {
  const a = artefactMap.data?.risks;
  if (!a) return '';

  const dt = a.generated_at ? new Date(a.generated_at) : null;
  const pad = n => String(n).padStart(2, '0');

  const formatted =
    dt && !Number.isNaN(dt.getTime())
      ? `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${String(dt.getFullYear()).slice(-2)} - ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
      : 'Unknown time';

  const version = a.version_number ?? '-';
  const email = a.generated_by_email_snapshot || 'Unknown user';

  return `Version ${version} | Generated ${formatted} | by ${email}`;
})() }}"
          verticalAlign="center"
        />
      </View>
    </Container>
  </View>
  <View
    id="7d3a2"
    disabled={false}
    hidden={false}
    iconPosition="left"
    label="Financials"
    viewKey="View 6"
  >
    <Container
      id="container6"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="financialsTitle"
          value="### {{ artefactMap.data?.financials?.content_metadata?.title || 'Financials' }}"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="financialsBody"
          margin="0px 0px 8px 0px"
          style={{
            color: "textLight",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "400",
          }}
          value="{{
  viewerStatesByType.data?.financials?.state &&
  viewerStatesByType.data?.financials?.state !== 'complete'
    ? viewerStatesByType.data?.financials?.message
    : (
        artefactMap.data?.financials?.content_markdown ||
        artefactMap.data?.financials?.content_metadata?.markdown ||
        artefactMap.data?.financials?.content_metadata?.summary ||
        'No financials artefact found.'
      )
        ?.replace(/^#\s+/gm, '### ')
        ?.replace(/^##\s+/gm, '### ')
        ?.replace(/^###\s+/gm, '#### ')
}}"
          verticalAlign="center"
        />
        <Text
          id="financialsMetadata"
          margin="8px 0px 0px 0px"
          style={{
            color: "secondary",
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: "400",
          }}
          value="{{ (() => {
  const a = artefactMap.data?.financials;
  if (!a) return '';

  const dt = a.generated_at ? new Date(a.generated_at) : null;
  const pad = n => String(n).padStart(2, '0');

  const formatted =
    dt && !Number.isNaN(dt.getTime())
      ? `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${String(dt.getFullYear()).slice(-2)} - ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
      : 'Unknown time';

  const version = a.version_number ?? '-';
  const email = a.generated_by_email_snapshot || 'Unknown user';

  return `Version ${version} | Generated ${formatted} | by ${email}`;
})() }}"
          verticalAlign="center"
        />
      </View>
    </Container>
  </View>
  <View
    id="0df86"
    disabled={false}
    hidden={false}
    iconPosition="left"
    label="PDF"
    viewKey="View 7"
  >
    <Container
      id="container7"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="pdfTitle"
          value="### {{ artefactMap.data?.pdf?.content_metadata?.title || 'PDF' }}"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="pdfBody"
          margin="0px 0px 8px 0px"
          style={{
            color: "textLight",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: "400",
          }}
          value="{{
  (() => {
    const previewUrl = artefactMap.data?.pdf?.additional_metadata_json?.pdfmonkey_preview_url;
    const downloadUrl = artefactMap.data?.pdf?.additional_metadata_json?.pdfmonkey_download_url;
    const status = artefactMap.data?.pdf?.additional_metadata_json?.pdfmonkey_status;

    if (previewUrl && downloadUrl) {
      return 'PDF ready. Use Preview PDF to review it in-browser or Download PDF to save a copy.';
    }

    if (status === 'success' && (!previewUrl || !downloadUrl)) {
      return 'PDF generated, but one or more PDF links are not available yet. Refresh the page or regenerate if the issue persists.';
    }

    if (viewerStatesByType.data?.pdf?.state && viewerStatesByType.data?.pdf?.state !== 'complete') {
      return viewerStatesByType.data?.pdf?.message;
    }

    return (
      artefactMap.data?.pdf?.content_markdown ||
      artefactMap.data?.pdf?.content_metadata?.summary ||
      'No PDF artefact found.'
    );
  })()
}}"
          verticalAlign="center"
        />
        <Text
          id="pdfMetadata"
          margin="8px 0px 0px 0px"
          style={{
            color: "secondary",
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: "400",
          }}
          value="{{ (() => {
  const a = artefactMap.data?.pdf;
  if (!a) return '';

  const dt = a.generated_at ? new Date(a.generated_at) : null;
  const pad = n => String(n).padStart(2, '0');

  const formatted =
    dt && !Number.isNaN(dt.getTime())
      ? `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${String(dt.getFullYear()).slice(-2)} - ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
      : 'Unknown time';

  const version = a.version_number ?? '-';
  const email = a.generated_by_email_snapshot || 'Unknown user';

  return `Version ${version} | Generated ${formatted} | by ${email}`;
})() }}"
          verticalAlign="center"
        />
      </View>
    </Container>
  </View>
</Container>
