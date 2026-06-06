const toRows = (data) => {
  if (Array.isArray(data)) return data;

  if (!data || typeof data !== "object") return [];

  const keys = Object.keys(data);
  if (!keys.length) return [];

  const rowCount = Math.max(
    ...keys.map((key) => Array.isArray(data[key]) ? data[key].length : 0),
    0
  );

  return Array.from({ length: rowCount }, (_, index) =>
    Object.fromEntries(
      keys.map((key) => [
        key,
        Array.isArray(data[key]) ? data[key][index] : data[key]
      ])
    )
  );
};

const rows = toRows(getCurrentArtefactsForEntity.data);

return rows.reduce((acc, row) => {
  const key = String(row?.artefact_code || "").toLowerCase();
  if (!key) return acc;
  acc[key] = row;
  return acc;
}, {});