// Idempotent: if the wizard already settled (poller-driven path), no-op.
if (generationStatus.value === 'complete' || generationStatus.value === 'error') {
  return;
}

try {
  // Capture the trigger's resolved value AND fall back to .data, because
  // Retool's React state for query.data lags the awaited promise resolution
  // and (when mock-response is on) can carry a stale stub.
  const triggerResult = await getLatestPdfForEntity.trigger();
  const data = triggerResult ?? getLatestPdfForEntity.data;

  let row = null;
  if (Array.isArray(data)) {
    row = data[0] || null;
  } else if (data && typeof data === 'object') {
    const keys = Object.keys(data);
    const len = keys.length
      ? Math.max(...keys.map(k => Array.isArray(data[k]) ? data[k].length : 0), 0)
      : 0;
    if (len > 0) {
      row = Object.fromEntries(
        keys.map(k => [k, Array.isArray(data[k]) ? data[k][0] : data[k]])
      );
    }
  }

  if (!row) {
    throw new Error('No generation run was found. The workflow may not have started.');
  }

  const SUCCESS = ['success', 'generated', 'completed', 'done'];
  const status = String(row.pdfmonkey_status || '').toLowerCase();

  if (!SUCCESS.includes(status) || !row.pdfmonkey_preview_url) {
    const cause = row.pdfmonkey_failure_cause
      ? ` Cause: ${row.pdfmonkey_failure_cause}.`
      : '';
    throw new Error(`PDF not ready. Status: ${row.pdfmonkey_status || 'unknown'}.${cause}`);
  }

  await generationResult.setValue({
    pdfmonkey_status: row.pdfmonkey_status,
    pdfmonkey_preview_url: row.pdfmonkey_preview_url,
    pdfmonkey_download_url: row.pdfmonkey_download_url,
    pdfmonkey_document_id: row.pdfmonkey_document_id,
    run_id: row.run_id,
    generated_at: row.run_updated_at || row.run_created_at,
  });
  await generationStatus.setValue('complete');
} catch (err) {
  await generationStatus.setValue('error');
  await generationError.setValue(String(err?.message || err));
  utils.showNotification({
    title: 'Generation failed',
    description: String(err?.message || err),
    notificationType: 'error',
  });
}