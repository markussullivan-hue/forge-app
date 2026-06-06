const map = artefactMap.data || {};

const artefactRows = Object.values(map)
  .filter((row) => row && row.artefact_code)
  .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
  .map((row) => ({
    artefact_code: String(row.artefact_code).toLowerCase(),
    artefact_name: row.artefact_name,
    sort_order: Number(row.sort_order),
    rendering_pattern: row.rendering_pattern,
    canonical_artefact_type: row.canonical_artefact_type,
    version_id: row.version_id,
    version_number: row.version_number,
    generated_at: row.generated_at,
    generated_by_email_snapshot: row.generated_by_email_snapshot,
    content_metadata: row.content_metadata,
    model_code: row.model_code,
    model_name: row.model_name
  }));

artefactRows.push({
  artefact_code: 'pdf',
  artefact_name: 'PDF',
  sort_order: 9999,
  rendering_pattern: 'pdf_viewer',
  canonical_artefact_type: 'pdf',
  version_id: null,
  version_number: null,
  generated_at: null,
  generated_by_email_snapshot: null,
  content_metadata: null,
  model_code: null,
  model_name: null
});

return artefactRows;