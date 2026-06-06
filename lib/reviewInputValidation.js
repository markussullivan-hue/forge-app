const materialType = materialTypeSelect.value;
const aiRelevance = aiRelevanceSelect.value;
const methodologyLens = methodologyLensSelect.value;
const pastedText = String(governanceTextInput.value || "").trim();

const characterCount = pastedText.length;
const wordCount = pastedText
  ? pastedText.split(/\s+/).filter(Boolean).length
  : 0;

const errors = [];
const warnings = [];

if (!materialType) {
  errors.push("Select the material type.");
}

if (!aiRelevance) {
  errors.push("Select the AI relevance.");
}

if (!methodologyLens) {
  errors.push("Select the methodology or governance lens.");
}

if (!pastedText) {
  errors.push("Paste the governance text to review.");
}

if (pastedText && characterCount < 750) {
  errors.push("Paste a fuller governance extract. The review needs at least 750 characters to be meaningful.");
}

if (characterCount > 120000) {
  errors.push("The pasted text is too long for V2a.0. Keep it below 120,000 characters for this first version.");
}

if (wordCount > 18000) {
  warnings.push("This is a large paste-in review. The workflow should summarise and challenge it, but response time may be longer.");
}

return {
  canRun: errors.length === 0,
  materialType,
  aiRelevance,
  methodologyLens,
  characterCount,
  wordCount,
  errors,
  warnings,
  inputPreview: pastedText.slice(0, 500)
};