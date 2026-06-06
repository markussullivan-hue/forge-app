const rows = {{ formatDataAsArray(getCurrentArtefactsForEntity.data) }} || [];

const parseMaybeJson = (v) => {
  if (v == null) return null;
  if (typeof v === 'object') return v;
  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return null;
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  }
  return null;
};

return Object.fromEntries(
rows.
filter((r) => r && r.type_code != null).
map((r) => {
  const type = String(r.type_code || '').toLowerCase();
  return [
  type,
  {
    ...r,
    content_metadata_obj: parseMaybeJson(r.content_metadata),
    additional_metadata_obj: parseMaybeJson(r.additional_metadata_json) }];


}));