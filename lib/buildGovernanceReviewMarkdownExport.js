const parseMaybeJson = value => {
  if (!value) return null;

  if (typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  return null;
};

const normaliseArray = value => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  return [value];
};

const clean = value => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const storedResult =
  getGovernanceReviewResult.data?.result_json?.[0] ||
  getGovernanceReviewResult.data?.[0]?.result_json ||
  null;

const result =
  parseMaybeJson(storedResult) ||
  runGovernanceReviewFlow.data?.result ||
  runGovernanceReviewFlow.data?.display ||
  runGovernanceReviewFlow.data?.display_model ||
  {};

const overallResult = clean(
  result.overall_result ||
  result.overallResult ||
  "Not stated"
);

const scorePercentage = clean(
  result.score_percentage ??
  result.scorePercentage ??
  ""
);

const executiveSummary = clean(
  result.executive_summary ||
  result.executiveSummary ||
  ""
);

const decisionReadinessSummary = clean(
  result.decision_readiness_summary ||
  result.decisionReadinessSummary ||
  ""
);

const decisiveWeaknesses = normaliseArray(
  result.decisive_weaknesses ||
  result.decisiveWeaknesses ||
  []
);

const sectionScores = normaliseArray(
  result.section_scores ||
  result.sectionScores ||
  []
);

const evidenceFindings = normaliseArray(
  result.evidence_findings ||
  result.evidenceFindings ||
  result.evidence ||
  []
);

const suggestedRewrites = normaliseArray(
  result.suggested_rewrites ||
  result.suggestedRewrites ||
  []
);

const sponsorQuestions = normaliseArray(
  result.sponsor_questions ||
  result.sponsorQuestions ||
  []
);

const qualityFlags = normaliseArray(
  result.quality_flags ||
  result.qualityFlags ||
  []
);

const lines = [];

lines.push("# FORGE Governance Pack Review");
lines.push("");

lines.push("## Overall result");
lines.push("");
lines.push(`**Result:** ${overallResult}`);

if (scorePercentage !== "") {
  lines.push(`**Score:** ${scorePercentage}%`);
}

lines.push("");

if (executiveSummary) {
  lines.push("## Executive summary");
  lines.push("");
  lines.push(executiveSummary);
  lines.push("");
}

if (decisionReadinessSummary) {
  lines.push("## Decision-readiness summary");
  lines.push("");
  lines.push(decisionReadinessSummary);
  lines.push("");
}

if (decisiveWeaknesses.length > 0) {
  lines.push("## Decisive weaknesses");
  lines.push("");

  decisiveWeaknesses.forEach((item, index) => {
    const weakness = clean(
      item.weakness ||
      item.finding ||
      item.area ||
      `Weakness ${index + 1}`
    );

    const whyItMatters = clean(
      item.why_it_matters ||
      item.whyItMatters ||
      ""
    );

    const severity = clean(
      item.severity ||
      ""
    );

    const recommendedAction = clean(
      item.recommended_action ||
      item.recommendedAction ||
      ""
    );

    lines.push(`### ${index + 1}. ${weakness}`);
    lines.push("");

    if (severity) {
      lines.push(`**Severity:** ${severity}`);
      lines.push("");
    }

    if (whyItMatters) {
      lines.push(`**Why it matters:** ${whyItMatters}`);
      lines.push("");
    }

    if (recommendedAction) {
      lines.push(`**Recommended action:** ${recommendedAction}`);
      lines.push("");
    }
  });
}

if (sectionScores.length > 0) {
  lines.push("## Section-level review");
  lines.push("");

  sectionScores.forEach((item, index) => {
    const section = clean(
      item.section ||
      item.area ||
      `Section ${index + 1}`
    );

    const rating = clean(
      item.rating ||
      item.score ||
      item.evidence_state ||
      item.evidenceState ||
      ""
    );

    const score = clean(
      item.score_percentage ??
      item.scorePercentage ??
      ""
    );

    const rationale = clean(
      item.rationale ||
      item.finding ||
      ""
    );

    const recommendedAction = clean(
      item.recommended_action ||
      item.recommendedAction ||
      ""
    );

    lines.push(`### ${section}`);
    lines.push("");

    if (rating) {
      lines.push(`**Rating:** ${rating}`);
    }

    if (score !== "") {
      lines.push(`**Score:** ${score}%`);
    }

    if (rating || score !== "") {
      lines.push("");
    }

    if (rationale) {
      lines.push(rationale);
      lines.push("");
    }

    if (recommendedAction) {
      lines.push(`**Recommended action:** ${recommendedAction}`);
      lines.push("");
    }
  });
}

if (evidenceFindings.length > 0) {
  lines.push("## Evidence findings");
  lines.push("");

  evidenceFindings.forEach((item, index) => {
    const finding = clean(
      item.finding ||
      item.claim ||
      item.summary ||
      item.observation ||
      `Evidence finding ${index + 1}`
    );

    const evidenceBasis = clean(
      item.evidence_basis ||
      item.evidenceBasis ||
      item.evidence_state ||
      item.evidenceState ||
      item.basis ||
      "Not stated"
    );

    const quoteOrReference = clean(
      item.quote_or_reference ||
      item.quoteOrReference ||
      item.reference ||
      item.quote ||
      ""
    );

    const implication = clean(
      item.implication ||
      item.impact ||
      item.risk_if_unconfirmed ||
      item.riskIfUnconfirmed ||
      ""
    );

    const whatToConfirmNext = clean(
      item.what_to_confirm_next ||
      item.whatToConfirmNext ||
      ""
    );

    lines.push(`### ${index + 1}. ${finding}`);
    lines.push("");
    lines.push(`**Evidence basis:** ${evidenceBasis}`);
    lines.push("");

    if (quoteOrReference) {
      lines.push(`**Quote / reference:** ${quoteOrReference}`);
      lines.push("");
    }

    if (implication) {
      lines.push(`**Implication:** ${implication}`);
      lines.push("");
    }

    if (whatToConfirmNext) {
      lines.push(`**What to confirm next:** ${whatToConfirmNext}`);
      lines.push("");
    }
  });
}

if (suggestedRewrites.length > 0) {
  lines.push("## Suggested rewrites");
  lines.push("");

  suggestedRewrites.forEach((item, index) => {
    const targetSection = clean(
      item.target_section ||
      item.targetSection ||
      item.section ||
      `Suggested rewrite ${index + 1}`
    );

    const currentIssue = clean(
      item.current_issue ||
      item.currentIssue ||
      ""
    );

    const suggestedRewrite = clean(
      item.suggested_rewrite ||
      item.suggestedRewrite ||
      item.replacement_text ||
      item.replacementText ||
      ""
    );

    lines.push(`### ${targetSection}`);
    lines.push("");

    if (currentIssue) {
      lines.push(`**Current issue:** ${currentIssue}`);
      lines.push("");
    }

    if (suggestedRewrite) {
      lines.push("**Suggested rewrite:**");
      lines.push("");
      lines.push(suggestedRewrite);
      lines.push("");
    }
  });
}

if (sponsorQuestions.length > 0) {
  lines.push("## Sponsor / PMO questions");
  lines.push("");

  sponsorQuestions.forEach((item, index) => {
    if (typeof item === "string") {
      lines.push(`${index + 1}. ${clean(item)}`);
      return;
    }

    const question = clean(
      item.question ||
      `Question ${index + 1}`
    );

    const whyToAsk = clean(
      item.why_to_ask ||
      item.whyToAsk ||
      ""
    );

    const priority = clean(
      item.priority ||
      ""
    );

    lines.push(`${index + 1}. ${question}`);

    if (priority || whyToAsk) {
      lines.push("");

      if (priority) {
        lines.push(`   **Priority:** ${priority}`);
      }

      if (whyToAsk) {
        lines.push(`   **Why to ask:** ${whyToAsk}`);
      }

      lines.push("");
    }
  });

  lines.push("");
}

if (qualityFlags.length > 0) {
  lines.push("## Quality flags");
  lines.push("");

  qualityFlags.forEach((item, index) => {
    if (typeof item === "string") {
      lines.push(`${index + 1}. ${clean(item)}`);
      return;
    }

    const flag = clean(
      item.flag ||
      item.finding ||
      `Quality flag ${index + 1}`
    );

    const category = clean(
      item.category ||
      ""
    );

    const severity = clean(
      item.severity ||
      ""
    );

    const explanation = clean(
      item.explanation ||
      item.rationale ||
      ""
    );

    lines.push(`### ${index + 1}. ${flag}`);
    lines.push("");

    if (category) {
      lines.push(`**Category:** ${category}`);
    }

    if (severity) {
      lines.push(`**Severity:** ${severity}`);
    }

    if (category || severity) {
      lines.push("");
    }

    if (explanation) {
      lines.push(explanation);
      lines.push("");
    }
  });
}

lines.push("---");
lines.push("");
lines.push("Generated by FORGE Governance Pack Review.");
lines.push("Source text is not included in this export.");

const markdown = lines
  .join("\n")
  .replace(/\n{4,}/g, "\n\n\n")
  .trim();

const now = new Date();
const pad = value => String(value).padStart(2, "0");

const fileStamp = [
  now.getFullYear(),
  pad(now.getMonth() + 1),
  pad(now.getDate())
].join("-");

return {
  fileName: `forge-governance-pack-review-${fileStamp}.md`,
  markdown
};