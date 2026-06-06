const code = (selectedArtefactCodeState.value || '').toString().toLowerCase();
const list = orderedArtefacts.data || [];
const row = list.find((r) => r.artefact_code === code) || list[0] || null;

if (!row) {
  return { pattern: 'empty', artefact_name: '', sections: [] };
}

const cm = row.content_metadata || {};

const base = {
  artefact_code: row.artefact_code,
  artefact_name: row.artefact_name,
  rendering_pattern: row.rendering_pattern,
  canonical_artefact_type: row.canonical_artefact_type,
  version_number: row.version_number,
  generated_at: row.generated_at,
  generated_by_email_snapshot: row.generated_by_email_snapshot,
  model_code: row.model_code,
  model_name: row.model_name
};

const asDynamicRegister = () => ({
  ...base,
  pattern: 'dynamic_register',
  columns: Array.isArray(cm.columns) ? cm.columns : [],
  rows: Array.isArray(cm.rows) ? cm.rows : [],
  summary: cm.summary || '',
  footer_note: cm.footer_note || ''
});

const asEvidenceRegister = () => ({
  ...base,
  pattern: 'register_table',
  section_1: cm.section_1 || { intro: '', rows: [] },
  section_2: cm.section_2 || { intro: '', rows: [] },
  section_3: cm.section_3 || { intro: '', rows: [] }
});

if (row.rendering_pattern === 'register_table') {
  // Two distinct content shapes co-exist under register_table:
  //   - FORGE Observations (canonical_artefact_type = 'derivation_evaluation') → section_1/2/3
  //   - Operational registers/logs/catalogues → dynamic columns + rows
  if (row.canonical_artefact_type === 'derivation_evaluation') {
    return asEvidenceRegister();
  }
  return asDynamicRegister();
}

if (row.rendering_pattern === 'dynamic_register') {
  // Kept for forward compatibility if rendering_pattern is ever set explicitly.
  return asDynamicRegister();
}

if (row.rendering_pattern === 'narrative') {
  const sections = Object.entries(cm).map(([key, value]) => ({
    section_key: key,
    section_title: key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    narrative: (value && value.narrative) || '',
    bullets: Array.isArray(value && value.bullets) ? value.bullets : []
  }));
  return { ...base, pattern: 'narrative', sections };
}

if (row.rendering_pattern === 'pdf_viewer') {
  return { ...base, pattern: 'pdf_viewer' };
}

return { ...base, pattern: 'unknown' };