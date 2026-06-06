const nowIso = () => new Date().toISOString();

const unwrapSingleItemArray = value => {
  if (
    Array.isArray(value) &&
    value.length === 1 &&
    value[0] !== null &&
    value[0] !== undefined
  ) {
    return value[0];
  }

  return value;
};

const parseMaybeJson = (value, fallback = null) => {
  const unwrapped = unwrapSingleItemArray(value);

  if (unwrapped === null || unwrapped === undefined || unwrapped === "") {
    return fallback;
  }

  if (typeof unwrapped === "object") {
    return unwrapped;
  }

  if (typeof unwrapped === "string") {
    try {
      return JSON.parse(unwrapped);
    } catch {
      return fallback;
    }
  }

  return fallback;
};

const asArray = value => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
};

const firstNonEmptyString = (...values) => {
  for (const value of values) {
    const unwrapped = unwrapSingleItemArray(value);

    if (typeof unwrapped === "string" && unwrapped.trim()) {
      return unwrapped.trim();
    }
  }

  return "";
};

const firstDefined = (...values) => {
  for (const value of values) {
    const unwrapped = unwrapSingleItemArray(value);

    if (
      unwrapped !== undefined &&
      unwrapped !== null &&
      unwrapped !== ""
    ) {
      return unwrapped;
    }
  }

  return null;
};

const unwrapTriggerResult = value => {
  if (!value) return value;

  if (
    typeof value === "object" &&
    value.data !== undefined &&
    Object.keys(value).length <= 3
  ) {
    return value.data;
  }

  return value;
};

const rowsFromRetoolData = data => {
  const unwrapped = unwrapTriggerResult(data);

  if (!unwrapped) return [];

  if (Array.isArray(unwrapped)) {
    return unwrapped.filter(Boolean);
  }

  if (typeof unwrapped !== "object") {
    return [];
  }

  if (Array.isArray(unwrapped.data)) {
    return unwrapped.data.filter(Boolean);
  }

  const keys = Object.keys(unwrapped);
  const arrayKeys = keys.filter(key => Array.isArray(unwrapped[key]));

  if (arrayKeys.length) {
    const rowCount = Math.max(...arrayKeys.map(key => unwrapped[key].length));

    return Array.from({ length: rowCount }, (_, index) => {
      const row = {};

      for (const key of keys) {
        const value = unwrapped[key];

        row[key] = Array.isArray(value)
          ? value[index]
          : value;
      }

      return row;
    }).filter(row =>
      Object.values(row).some(value => value !== undefined && value !== null)
    );
  }

  if (
    unwrapped.result_json ||
    unwrapped.review_result ||
    unwrapped.result ||
    unwrapped.review_id ||
    unwrapped.status ||
    unwrapped.overall_result ||
    unwrapped.executive_summary
  ) {
    return [unwrapped];
  }

  return [];
};

const formatListForMarkdown = (items, formatter) => {
  const rows = asArray(items).filter(Boolean);

  if (!rows.length) return "";

  return rows
    .map((item, index) => formatter(item, index))
    .filter(Boolean)
    .join("\n\n");
};

const normaliseReviewResult = source => {
  const unwrappedSource = unwrapSingleItemArray(source);
  const result = parseMaybeJson(unwrappedSource, {}) || {};

  const overallResult = firstNonEmptyString(
    result.overall_result,
    result.overallResult,
    result.rating,
    result.readiness,
    result.readiness_state,
    "Not assessed"
  );

  const scorePercentage = firstDefined(
    result.score_percentage,
    result.scorePercentage,
    result.score,
    result.overall_score
  );

  const executiveSummary = firstNonEmptyString(
    result.executive_summary,
    result.executiveSummary,
    result.summary,
    "No executive summary returned."
  );

  const decisionReadinessSummary = firstNonEmptyString(
    result.decision_readiness_summary,
    result.decisionReadinessSummary,
    result.readiness_summary,
    "No decision-readiness summary returned."
  );

  const decisiveWeaknesses = asArray(
    firstDefined(
      result.decisive_weaknesses,
      result.decisiveWeaknesses,
      result.weaknesses,
      []
    )
  );

  const sectionScores = asArray(
    firstDefined(
      result.section_scores,
      result.sectionScores,
      result.section_scores_table,
      result.sectionScoresTable,
      result.sections,
      []
    )
  );

  const evidenceFindings = asArray(
    firstDefined(
      result.evidence_findings,
      result.evidenceFindings,
      result.findings,
      []
    )
  );

  const suggestedRewrites = asArray(
    firstDefined(
      result.suggested_rewrites,
      result.suggestedRewrites,
      result.rewrites,
      []
    )
  );

  const sponsorQuestions = asArray(
    firstDefined(
      result.sponsor_questions,
      result.sponsorQuestions,
      result.questions,
      []
    )
  );

  const qualityFlags = asArray(
    firstDefined(
      result.quality_flags,
      result.qualityFlags,
      result.flags,
      []
    )
  );

  const sectionScoresTable = sectionScores.map((item, index) => ({
    section:
      item?.section ||
      item?.name ||
      item?.title ||
      `Section ${index + 1}`,
    score_percentage:
      item?.score_percentage ??
      item?.scorePercentage ??
      item?.score ??
      null,
    rating:
      item?.rating ||
      item?.readiness ||
      item?.result ||
      "",
    rationale:
      item?.rationale ||
      item?.reason ||
      item?.commentary ||
      ""
  }));

  const generatedMarkdown = [
    "# Governance review",
    "",
    "## Overall result",
    "",
    `**Result:** ${overallResult}`,
    scorePercentage === null ||
    scorePercentage === undefined ||
    scorePercentage === ""
      ? ""
      : `**Score:** ${scorePercentage}%`,
    "",
    "## Executive summary",
    "",
    executiveSummary,
    "",
    "## Decision-readiness summary",
    "",
    decisionReadinessSummary,
    "",
    decisiveWeaknesses.length ? "## Decisive weaknesses" : "",
    "",
    formatListForMarkdown(decisiveWeaknesses, (item, index) => {
      if (typeof item === "string") return `${index + 1}. ${item}`;

      return [
        `${index + 1}. ${item.weakness || item.title || item.finding || "Weakness"}`,
        item.severity ? `   - Severity: ${item.severity}` : "",
        item.why_it_matters || item.whyItMatters
          ? `   - Why it matters: ${item.why_it_matters || item.whyItMatters}`
          : "",
        item.recommended_action || item.recommendedAction
          ? `   - Recommended action: ${item.recommended_action || item.recommendedAction}`
          : ""
      ]
        .filter(Boolean)
        .join("\n");
    }),
    "",
    sectionScoresTable.length ? "## Section scores" : "",
    "",
    formatListForMarkdown(sectionScoresTable, (item, index) => {
      return [
        `${index + 1}. ${item.section}`,
        item.score_percentage === null ||
        item.score_percentage === undefined ||
        item.score_percentage === ""
          ? ""
          : `   - Score: ${item.score_percentage}%`,
        item.rating ? `   - Rating: ${item.rating}` : "",
        item.rationale ? `   - Rationale: ${item.rationale}` : ""
      ]
        .filter(Boolean)
        .join("\n");
    }),
    "",
    evidenceFindings.length ? "## Evidence findings" : "",
    "",
    formatListForMarkdown(evidenceFindings, (item, index) => {
      if (typeof item === "string") return `${index + 1}. ${item}`;

      return [
        `${index + 1}. ${item.finding || item.title || "Finding"}`,
        item.evidence_basis || item.evidenceBasis
          ? `   - Evidence basis: ${item.evidence_basis || item.evidenceBasis}`
          : "",
        item.quote_or_reference || item.quoteOrReference
          ? `   - Reference: ${item.quote_or_reference || item.quoteOrReference}`
          : "",
        item.implication ? `   - Implication: ${item.implication}` : ""
      ]
        .filter(Boolean)
        .join("\n");
    }),
    "",
    sponsorQuestions.length ? "## Sponsor questions" : "",
    "",
    formatListForMarkdown(sponsorQuestions, (item, index) => {
      if (typeof item === "string") return `${index + 1}. ${item}`;

      return [
        `${index + 1}. ${item.question || item.title || "Question"}`,
        item.priority ? `   - Priority: ${item.priority}` : "",
        item.why_to_ask || item.whyToAsk || item.rationale
          ? `   - Why to ask: ${item.why_to_ask || item.whyToAsk || item.rationale}`
          : ""
      ]
        .filter(Boolean)
        .join("\n");
    }),
    "",
    suggestedRewrites.length ? "## Suggested rewrites" : "",
    "",
    formatListForMarkdown(suggestedRewrites, (item, index) => {
      if (typeof item === "string") return `${index + 1}. ${item}`;

      return [
        `${index + 1}. ${
          item.target_section ||
          item.targetSection ||
          item.section ||
          "Target section"
        }`,
        item.current_issue || item.currentIssue
          ? `   - Current issue: ${item.current_issue || item.currentIssue}`
          : "",
        item.suggested_rewrite || item.suggestedRewrite
          ? `   - Suggested rewrite: ${item.suggested_rewrite || item.suggestedRewrite}`
          : ""
      ]
        .filter(Boolean)
        .join("\n");
    }),
    "",
    qualityFlags.length ? "## Quality flags" : "",
    "",
    formatListForMarkdown(qualityFlags, (item, index) => {
      if (typeof item === "string") return `${index + 1}. ${item}`;

      return [
        `${index + 1}. ${item.flag || item.title || item.finding || "Quality flag"}`,
        item.category ? `   - Category: ${item.category}` : "",
        item.severity || item.priority
          ? `   - Severity: ${item.severity || item.priority}`
          : "",
        item.explanation || item.rationale || item.reason
          ? `   - Explanation: ${item.explanation || item.rationale || item.reason}`
          : ""
      ]
        .filter(Boolean)
        .join("\n");
    })
  ]
    .filter(line => line !== "")
    .join("\n");

  const markdown = firstNonEmptyString(
    result.markdown,
    result.markdown_review,
    result.full_markdown,
    generatedMarkdown
  );

  const copySummary = firstNonEmptyString(
    result.copy_summary,
    [
      "FORGE Governance Pack Review",
      "",
      `Overall result: ${overallResult}`,
      scorePercentage === null ||
      scorePercentage === undefined ||
      scorePercentage === ""
        ? ""
        : `Score: ${scorePercentage}%`,
      "",
      "Executive summary:",
      executiveSummary,
      "",
      "Decision-readiness summary:",
      decisionReadinessSummary
    ]
      .filter(line => line !== "")
      .join("\n")
  );

  const copyFullReview = firstNonEmptyString(
    result.copy_full_review,
    markdown
  );

  return {
    ...result,

    overall_result: overallResult,
    score_percentage: scorePercentage,
    executive_summary: executiveSummary,
    decision_readiness_summary: decisionReadinessSummary,

    decisive_weaknesses: decisiveWeaknesses,
    section_scores: sectionScores,
    section_scores_table: sectionScoresTable,
    evidence_findings: evidenceFindings,
    suggested_rewrites: suggestedRewrites,
    sponsor_questions: sponsorQuestions,
    quality_flags: qualityFlags,

    markdown,
    copy_summary: copySummary,
    copy_full_review: copyFullReview
  };
};

try {
  const validationRaw =
    typeof reviewInputValidation !== "undefined" &&
    typeof reviewInputValidation.trigger === "function"
      ? await reviewInputValidation.trigger()
      : null;

  const validation =
    unwrapTriggerResult(validationRaw) ||
    reviewInputValidation.data ||
    {};

  if (!validation.canRun) {
    const validationMessage =
      asArray(validation.errors).filter(Boolean).join("\n") ||
      validation.message ||
      "Complete the required governance review inputs before running the review.";

    utils.showNotification({
      title: "Review not ready",
      description: validationMessage,
      notificationType: "warning"
    });

    return {
      success: false,
      review_id: null,
      stored_result_found: false,
      stored_row: null,
      result: null,
      display: null,
      display_model: null,
      copy_summary: "",
      copy_full_review: "",
      markdown: "",
      completed_at: null,
      error: validationMessage
    };
  }

  const preparedRaw = await prepareGovernanceReviewRun.trigger();

  const preparedData =
    unwrapTriggerResult(preparedRaw) ||
    prepareGovernanceReviewRun.data ||
    {};

  const preparedReviewId = firstNonEmptyString(
    preparedData.review_id,
    preparedData?.[0]?.review_id,
    preparedData?.review_id?.[0],
    prepareGovernanceReviewRun.data?.review_id,
    prepareGovernanceReviewRun.data?.[0]?.review_id,
    prepareGovernanceReviewRun.data?.review_id?.[0]
  );

  if (!preparedReviewId) {
    throw new Error("prepareGovernanceReviewRun did not return a review_id.");
  }

  if (
    typeof currentGovernanceReviewId !== "undefined" &&
    typeof currentGovernanceReviewId.setValue === "function"
  ) {
    await currentGovernanceReviewId.setValue(preparedReviewId);
  }

  if (
    typeof activeGovernanceReviewIdState !== "undefined" &&
    typeof activeGovernanceReviewIdState.setValue === "function"
  ) {
    await activeGovernanceReviewIdState.setValue(preparedReviewId);
  }

  if (
    typeof governanceReviewExportResultState !== "undefined" &&
    typeof governanceReviewExportResultState.setValue === "function"
  ) {
    await governanceReviewExportResultState.setValue(null);
  }

  if (
    typeof getGovernanceReviewResult !== "undefined" &&
    typeof getGovernanceReviewResult.reset === "function"
  ) {
    getGovernanceReviewResult.reset();
  }

  const workflowResult = await runGovernanceReviewQuery.trigger({
    additionalScope: {
      reviewId: preparedReviewId
    }
  });

  const storedRaw = await getGovernanceReviewResult.trigger({
    additionalScope: {
      reviewId: preparedReviewId
    }
  });

  const storedRows = rowsFromRetoolData(
    storedRaw || getGovernanceReviewResult.data
  );

  const storedRow =
    storedRows.find(row => String(row.review_id || "") === preparedReviewId) ||
    storedRows[0] ||
    null;

  const storedResult =
    parseMaybeJson(storedRow?.result_json, null) ||
    parseMaybeJson(storedRow?.review_result, null) ||
    parseMaybeJson(storedRow?.result, null) ||
    storedRow ||
    {};

  const displayModel = normaliseReviewResult(storedResult || {});

  const completedAt =
    firstNonEmptyString(
      storedRow?.completed_at,
      storedRow?.updated_at,
      storedRow?.created_at
    ) || nowIso();

  if (
    typeof governanceReviewExportResultState !== "undefined" &&
    typeof governanceReviewExportResultState.setValue === "function"
  ) {
    await governanceReviewExportResultState.setValue(displayModel);
  }

  return {
    success: true,
    review_id: preparedReviewId,

    stored_result_found: !!storedRow,
    stored_row: storedRow,

    result: displayModel,
    display: displayModel,
    display_model: displayModel,

    copy_summary: displayModel.copy_summary,
    copy_full_review: displayModel.copy_full_review,
    markdown: displayModel.copy_full_review || displayModel.markdown || "",

    completed_at: completedAt,

    workflow_result: workflowResult,
    prepared_at: firstNonEmptyString(
      preparedData.prepared_at,
      preparedData?.[0]?.prepared_at,
      preparedData?.prepared_at?.[0]
    )
  };
} catch (error) {
  const message =
    error?.message ||
    String(error || "Governance review failed.");

  utils.showNotification({
    title: "Governance review failed",
    description: message,
    notificationType: "error"
  });

  return {
    success: false,
    review_id:
      typeof currentGovernanceReviewId !== "undefined"
        ? currentGovernanceReviewId.value
        : null,
    stored_result_found: false,
    stored_row: null,
    result: null,
    display: null,
    display_model: null,
    copy_summary: "",
    copy_full_review: "",
    markdown: "",
    completed_at: null,
    error: message
  };
}