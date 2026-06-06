const source =
  governanceReviewExportResultState.value ||
  runGovernanceReviewFlow.data?.display_model ||
  runGovernanceReviewFlow.data?.display ||
  runGovernanceReviewFlow.data ||
  {};

const text = (value, fallback = "") => {
  if (value == null) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  return fallback;
};

const cleanSummary = (value) => {
  return text(value)
    .replace(/^FORGE Governance Pack Review\s*/i, "")
    .replace(/^Overall result:.*$/gim, "")
    .replace(/^Score:.*$/gim, "")
    .replace(/^Executive summary:\s*/gim, "")
    .replace(/^Decision-readiness summary:\s*/gim, "\n\nDecision-readiness: ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const asArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) return value.filter(Boolean);

    if (typeof value === "string" && value.trim()) {
      return value
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const sentence = (...parts) =>
  parts
    .map(part => text(part))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const formatNumberedList = (items, formatter, emptyText) => {
  if (!items.length) return emptyText;

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        return `${index + 1}. ${item}`;
      }

      return `${index + 1}. ${formatter(item)}`;
    })
    .filter(line => line.replace(/^\d+\.\s*/, "").trim())
    .join("\n");
};

const formatEvidence = (items) =>
  formatNumberedList(
    items,
    item => {
      const finding = text(item.finding || item.title || "Finding");
      const implication = text(item.implication);
      const basis = text(item.evidence_basis || item.basis);
      const reference = text(item.quote_or_reference || item.reference);

      return sentence(
        `${finding}.`,
        implication,
        basis ? `Evidence basis: ${basis}.` : "",
        reference ? `Reference: "${reference}"` : ""
      );
    },
    "No specific evidence findings were provided."
  );

const formatQuestions = (items) =>
  formatNumberedList(
    items,
    item => {
      const priority = text(item.priority);
      const question = text(item.question);
      const why = text(item.why_to_ask || item.why);

      return sentence(
        priority ? `[${priority}]` : "",
        question,
        why ? `Why this matters: ${why}` : ""
      );
    },
    "No sponsor questions were provided."
  );

const formatRewrites = (items) =>
  formatNumberedList(
    items,
    item => {
      const section = text(item.target_section || item.section || "Suggested improvement");
      const issue = text(item.current_issue || item.issue);
      const rewrite = text(item.suggested_rewrite || item.rewrite);

      return sentence(
        `${section}.`,
        issue ? `Issue: ${issue}` : "",
        rewrite ? `Suggested improvement: ${rewrite}` : ""
      );
    },
    "No suggested improvements were provided."
  );

const formatFlags = (items) =>
  formatNumberedList(
    items,
    item => {
      const severity = text(item.severity);
      const category = text(item.category);
      const flag = text(item.flag || item.title);
      const explanation = text(item.explanation || item.reason);

      const label = [severity, category].filter(Boolean).join(" / ");

      return sentence(
        label ? `[${label}]` : "",
        flag,
        explanation
      );
    },
    "No quality flags were raised."
  );

const formatSectionScores = (items) => {
  if (!items.length) {
    return "No section scores were available.";
  }

  return items
    .map(row => {
      const section = text(row.section || row.name || row.area || "Section");
      const result = text(row.result || row.rating || row.assessment || "Not assessed");
      const score = text(row.score || row.score_percentage || row.percentage || "");

      return score
        ? `${section}: ${result} (${score}/100)`
        : `${section}: ${result}`;
    })
    .join("\n");
};

const overallResult =
  source.overall_result ||
  source.result?.overall_result ||
  source.display_model?.overall_result ||
  "Not assessed";

const scorePercentage =
  source.score_percentage ??
  source.result?.score_percentage ??
  source.display_model?.score_percentage ??
  "";

const summary = cleanSummary(
  source.summary ||
  source.review_summary ||
  source.copy_summary ||
  ""
);

const evidenceFindings = asArray(
  source.evidence_findings,
  source.evidenceFindings
);

const sectionScores = asArray(
  source.section_scores,
  source.sections,
  source.sectionScores
);

const sponsorQuestions = asArray(
  source.sponsor_questions,
  source.sponsorQuestions
);

const suggestedRewrites = asArray(
  source.suggested_rewrites,
  source.suggestedRewrites
);

const qualityFlags = asArray(
  source.quality_flags,
  source.qualityFlags
);

const weaknesses = asArray(
  source.weaknesses,
  source.key_weaknesses,
  source.review_weaknesses
);

const exportedText = [
  "FORGE Logic™ Governance Review",
  "",
  `Overall result: ${overallResult}`,
  scorePercentage !== "" ? `Score: ${scorePercentage}%` : "",
  "",
  "Summary",
  "",
  summary || "No summary was provided.",
  "",
  "What the review found",
  "",
  formatEvidence(evidenceFindings),
  "",
  "Section scores",
  "",
  formatSectionScores(sectionScores),
  "",
  "Questions to ask before approving",
  "",
  formatQuestions(sponsorQuestions),
  "",
  "Suggested improvements",
  "",
  formatRewrites(suggestedRewrites),
  "",
  "Quality flags",
  "",
  formatFlags(qualityFlags),
  weaknesses.length ? "" : null,
  weaknesses.length ? "Additional weaknesses" : null,
  weaknesses.length ? "" : null,
  weaknesses.length
    ? weaknesses.map((item, index) => `${index + 1}. ${text(item)}`).join("\n")
    : null,
  "",
  "Generated by FORGE Logic™ Governance Review",
  `Generated on: ${new Date().toLocaleString()}`
]
  .filter(line => line !== null && line !== undefined)
  .join("\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

if (!exportedText) {
  utils.showNotification({
    title: "No review available",
    description: "Run a governance review before copying the export.",
    notificationType: "warning"
  });

  return {
    success: false,
    copied: false,
    reason: "No review available"
  };
}

await utils.copyToClipboard(exportedText);

utils.showNotification({
  title: "Review copied",
  description: "The buyer-friendly governance review has been copied to your clipboard.",
  notificationType: "success"
});

return {
  success: true,
  copied: true,
  character_count: exportedText.length,
  markdown: exportedText,
  export_text: exportedText
};