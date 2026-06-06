const safeValue = value => {
  if (value === undefined) return "undefined";
  if (value === null) return null;
  return value;
};

const safeKeys = value => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.keys(value);
};

const asArray = value => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

const previewText = value => {
  const text = String(value || "");
  return {
    length: text.length,
    word_count: text.trim()
      ? text.trim().split(/\s+/).filter(Boolean).length
      : 0,
    preview: text.slice(0, 300)
  };
};

return {
  materialTypeSelect: {
    exists: typeof materialTypeSelect !== "undefined",
    value:
      typeof materialTypeSelect !== "undefined"
        ? safeValue(materialTypeSelect.value)
        : "materialTypeSelect is not defined",
    selectedLabel:
      typeof materialTypeSelect !== "undefined"
        ? safeValue(materialTypeSelect.selectedLabel)
        : "materialTypeSelect is not defined",
    selectedItem:
      typeof materialTypeSelect !== "undefined"
        ? safeValue(materialTypeSelect.selectedItem)
        : "materialTypeSelect is not defined"
  },

  materialTypeOptions: {
    exists: typeof materialTypeOptions !== "undefined",
    dataType:
      typeof materialTypeOptions !== "undefined"
        ? Array.isArray(materialTypeOptions.data)
          ? "array"
          : typeof materialTypeOptions.data
        : "materialTypeOptions is not defined",
    dataKeys:
      typeof materialTypeOptions !== "undefined"
        ? safeKeys(materialTypeOptions.data)
        : [],
    rowCount:
      typeof materialTypeOptions !== "undefined"
        ? asArray(materialTypeOptions.data).length
        : 0,
    dataPreview:
      typeof materialTypeOptions !== "undefined"
        ? asArray(materialTypeOptions.data).slice(0, 10)
        : "materialTypeOptions is not defined",
    error:
      typeof materialTypeOptions !== "undefined"
        ? materialTypeOptions.error || null
        : "materialTypeOptions is not defined"
  },

  aiRelevanceSelect: {
    exists: typeof aiRelevanceSelect !== "undefined",
    value:
      typeof aiRelevanceSelect !== "undefined"
        ? safeValue(aiRelevanceSelect.value)
        : "aiRelevanceSelect is not defined",
    selectedLabel:
      typeof aiRelevanceSelect !== "undefined"
        ? safeValue(aiRelevanceSelect.selectedLabel)
        : "aiRelevanceSelect is not defined"
  },

  methodologyLensSelect: {
    exists: typeof methodologyLensSelect !== "undefined",
    value:
      typeof methodologyLensSelect !== "undefined"
        ? safeValue(methodologyLensSelect.value)
        : "methodologyLensSelect is not defined",
    selectedLabel:
      typeof methodologyLensSelect !== "undefined"
        ? safeValue(methodologyLensSelect.selectedLabel)
        : "methodologyLensSelect is not defined"
  },

  governanceTextInput: {
    exists: typeof governanceTextInput !== "undefined",
    valueStats:
      typeof governanceTextInput !== "undefined"
        ? previewText(governanceTextInput.value)
        : "governanceTextInput is not defined"
  },

  reviewInputValidation: {
    exists: typeof reviewInputValidation !== "undefined",
    data:
      typeof reviewInputValidation !== "undefined"
        ? reviewInputValidation.data
        : "reviewInputValidation is not defined",
    error:
      typeof reviewInputValidation !== "undefined"
        ? reviewInputValidation.error || null
        : "reviewInputValidation is not defined"
  }
};