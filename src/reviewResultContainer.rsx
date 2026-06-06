<Container
  id="reviewResultContainer"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  hidden="{{ runGovernanceReviewFlow.isFetching || !runGovernanceReviewFlow.data?.success }}"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Text
      id="reviewResultContainerTitle"
      hidden="false"
      value="#### Review result"
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <Text
      id="reviewSummaryTitle"
      value="### Executive Summary"
      verticalAlign="center"
    />
    <Text
      id="materialWeaknessesTitle"
      value="### Material Weaknesses"
      verticalAlign="center"
    />
    <Text
      id="reviewWeaknessesText"
      value={
        '{{\n  (() => {\n    const parseMaybeJson = value => {\n      if (!value) return null;\n      if (typeof value === "object") return value;\n\n      if (typeof value === "string") {\n        try {\n          return JSON.parse(value);\n        } catch {\n          return null;\n        }\n      }\n\n      return null;\n    };\n\n    const storedResult =\n      getGovernanceReviewResult.data?.result_json?.[0] ||\n      getGovernanceReviewResult.data?.[0]?.result_json ||\n      null;\n\n    const result =\n      runGovernanceReviewFlow.data?.result ||\n      runGovernanceReviewFlow.data?.display ||\n      runGovernanceReviewFlow.data?.display_model ||\n      parseMaybeJson(storedResult) ||\n      {};\n\n    const weaknesses =\n      result.decisive_weaknesses ||\n      result.weaknesses ||\n      result.decisiveWeaknesses ||\n      [];\n\n    if (!Array.isArray(weaknesses) || weaknesses.length === 0) {\n      return "No decisive weaknesses returned.";\n    }\n\n    return weaknesses\n      .map((item, index) => {\n        const weakness =\n          item.weakness ||\n          item.title ||\n          item.finding ||\n          `Weakness ${index + 1}`;\n\n        const whyItMatters =\n          item.why_it_matters ||\n          item.whyItMatters ||\n          "";\n\n        const severity =\n          item.severity ||\n          "";\n\n        const recommendedAction =\n          item.recommended_action ||\n          item.recommendedAction ||\n          item.action ||\n          "";\n\n        return [\n          `#### ${index + 1}. ${weakness}`,\n          severity ? `**Severity:** ${severity}` : "",\n          whyItMatters ? `**Why it matters:** ${whyItMatters}` : "",\n          recommendedAction ? `**Recommended action:** ${recommendedAction}` : ""\n        ]\n          .filter(Boolean)\n          .join("\\n\\n");\n      })\n      .join("\\n\\n---\\n\\n");\n  })()\n}}'
      }
      verticalAlign="center"
    />
    <Text
      id="reviewSummaryText"
      value={
        '{{\n  (() => {\n    const parseMaybeJson = value => {\n      if (!value) return null;\n      if (typeof value === "object") return value;\n\n      if (typeof value === "string") {\n        try {\n          return JSON.parse(value);\n        } catch {\n          return null;\n        }\n      }\n\n      return null;\n    };\n\n    const storedResult =\n      getGovernanceReviewResult.data?.result_json?.[0] ||\n      getGovernanceReviewResult.data?.[0]?.result_json ||\n      null;\n\n    const result =\n      runGovernanceReviewFlow.data?.result ||\n      runGovernanceReviewFlow.data?.display ||\n      runGovernanceReviewFlow.data?.display_model ||\n      parseMaybeJson(storedResult) ||\n      {};\n\n    const overallResult =\n      result.overall_result ||\n      result.overallResult ||\n      result.readiness ||\n      result.readiness_state ||\n      "Not assessed";\n\n    const score =\n      result.score_percentage ??\n      result.score ??\n      result.overall_score ??\n      null;\n\n    const executiveSummary =\n      result.executive_summary ||\n      result.executiveSummary ||\n      result.summary ||\n      "No executive summary returned.";\n\n    const decisionReadinessSummary =\n      result.decision_readiness_summary ||\n      result.decisionReadinessSummary ||\n      "No decision-readiness summary returned.";\n\n    return [\n      `### Overall result: ${overallResult}`,\n      score === null || score === undefined || score === ""\n        ? ""\n        : `**Score:** ${score}%`,\n      "",\n      "#### Executive summary",\n      executiveSummary,\n      "",\n      "#### Decision-readiness summary",\n      decisionReadinessSummary\n    ]\n      .filter(line => line !== "")\n      .join("\\n");\n  })()\n}}'
      }
      verticalAlign="center"
    />
    <Button
      id="copyReviewSummaryButton"
      disabled="{{ !runGovernanceReviewFlow.data?.display?.copy_summary && !runGovernanceReviewFlow.data?.result?.copy_summary }}"
      text="Copy Summary to Clipboard
"
    >
      <Event
        id="7d2f7114"
        event="click"
        method="run"
        params={{
          map: {
            src: 'const text =\n  runGovernanceReviewFlow.data?.display?.copy_summary ||\n  runGovernanceReviewFlow.data?.result?.copy_summary ||\n  "";\n\nif (!text.trim()) {\n  utils.showNotification({\n    title: "Nothing to copy",\n    description: "No review summary is available yet.",\n    notificationType: "warning"\n  });\n\n  return;\n}\n\nutils.copyToClipboard(text);\n\nutils.showNotification({\n  title: "Summary copied",\n  description: "The governance review summary has been copied to your clipboard.",\n  notificationType: "success"\n});',
          },
        }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Text
      id="sectionReviewRatingsTitle"
      value="### Section Review Ratings"
      verticalAlign="center"
    />
    <Table
      id="reviewSectionScoresTable"
      cellSelection="none"
      clearChangesetOnSave={true}
      data={
        '{{\n  (() => {\n    const parseMaybeJson = value => {\n      if (!value) return null;\n      if (typeof value === "object") return value;\n\n      if (typeof value === "string") {\n        try {\n          return JSON.parse(value);\n        } catch {\n          return null;\n        }\n      }\n\n      return null;\n    };\n\n    const storedResult =\n      getGovernanceReviewResult.data?.result_json?.[0] ||\n      getGovernanceReviewResult.data?.[0]?.result_json ||\n      null;\n\n    const result =\n      runGovernanceReviewFlow.data?.result ||\n      runGovernanceReviewFlow.data?.display ||\n      runGovernanceReviewFlow.data?.display_model ||\n      parseMaybeJson(storedResult) ||\n      {};\n\n    const sectionScores =\n      result.section_scores ||\n      result.sectionScores ||\n      [];\n\n    if (!Array.isArray(sectionScores)) {\n      return [];\n    }\n\n    return sectionScores.map((item, index) => ({\n      section:\n        item.section ||\n        item.area ||\n        `Section ${index + 1}`,\n\n      rating:\n        item.rating ||\n        item.score ||\n        item.evidence_state ||\n        "Not rated",\n\n      score_percentage:\n        item.score_percentage ??\n        item.scorePercentage ??\n        item.percentage ??\n        null,\n\n      rationale:\n        item.rationale ||\n        item.finding ||\n        item.what_good_would_look_like ||\n        ""\n    }));\n  })()\n}}'
      }
      defaultSelectedRow={{ mode: "index", indexType: "display", index: 0 }}
      emptyMessage="No rows found"
      enableSaveActions={true}
      rowHeight="medium"
      showBorder={true}
      showFooter={true}
      showHeader={true}
      toolbarPosition="bottom"
    >
      <Column
        id="844f1"
        alignment="left"
        format="tag"
        formatOptions={{ automaticColors: true }}
        groupAggregationMode="none"
        key="rating"
        label="Rating"
        placeholder="Select option"
        position="center"
        size={135}
        summaryAggregationMode="none"
        valueOverride="{{ _.startCase(item) }}"
      />
      <Column
        id="e7793"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="section"
        label="Section"
        placeholder="Enter value"
        position="center"
        size={185}
        summaryAggregationMode="none"
      />
      <Column
        id="94bc3"
        alignment="left"
        editableOptions={{ spellCheck: false }}
        format="string"
        groupAggregationMode="none"
        key="rationale"
        label="Rationale"
        placeholder="Enter value"
        position="center"
        size={613}
        summaryAggregationMode="none"
      />
      <Column
        id="a236f"
        alignment="center"
        editableOptions={{ showStepper: true }}
        format="decimal"
        formatOptions={{ showSeparators: true, notation: "standard" }}
        groupAggregationMode="sum"
        key="score_percentage"
        label="Score percentage"
        placeholder="Enter value"
        position="center"
        size={100}
        summaryAggregationMode="none"
      />
      <ToolbarButton
        id="1a"
        icon="bold/interface-text-formatting-filter-2"
        label="Filter"
        type="filter"
      />
      <ToolbarButton
        id="3c"
        icon="bold/interface-download-button-2"
        label="Download"
        type="custom"
      >
        <Event
          id="5e34570a"
          event="clickToolbar"
          method="exportData"
          pluginId="reviewSectionScoresTable"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
      <ToolbarButton
        id="4d"
        icon="bold/interface-arrows-round-left"
        label="Refresh"
        type="custom"
      >
        <Event
          id="b88e80b3"
          event="clickToolbar"
          method="refresh"
          pluginId="reviewSectionScoresTable"
          type="widget"
          waitMs="0"
          waitType="debounce"
        />
      </ToolbarButton>
    </Table>
    <Text
      id="reviewSponsorQuestions"
      value="### Sponsor questions"
      verticalAlign="center"
    />
    <Text
      id="reviewSuggestedRewrites"
      value="### Suggested rewrites"
      verticalAlign="center"
    />
    <Text
      id="reviewQualityFlags"
      value="### Quality flags"
      verticalAlign="center"
    />
    <Text
      id="reviewEvidenceFindings"
      value="### Evidence findings"
      verticalAlign="center"
    />
    <Text
      id="reviewSponsorQuestionsText"
      value={
        '{{\n  (() => {\n    const parseMaybeJson = value => {\n      if (!value) return null;\n      if (typeof value === "object") return value;\n\n      if (typeof value === "string") {\n        try {\n          return JSON.parse(value);\n        } catch {\n          return null;\n        }\n      }\n\n      return null;\n    };\n\n    const storedResult =\n      getGovernanceReviewResult.data?.result_json?.[0] ||\n      getGovernanceReviewResult.data?.[0]?.result_json ||\n      null;\n\n    const result =\n      runGovernanceReviewFlow.data?.result ||\n      runGovernanceReviewFlow.data?.display ||\n      runGovernanceReviewFlow.data?.display_model ||\n      parseMaybeJson(storedResult) ||\n      {};\n\n    const questions =\n      result.sponsor_questions ||\n      result.sponsorQuestions ||\n      result.questions ||\n      [];\n\n    if (!Array.isArray(questions) || questions.length === 0) {\n      return "No sponsor or PMO questions returned.";\n    }\n\n    return questions\n      .map((item, index) => {\n        if (typeof item === "string") {\n          return `#### ${index + 1}. ${item}`;\n        }\n\n        const question =\n          item.question ||\n          item.title ||\n          `Question ${index + 1}`;\n\n        const whyToAsk =\n          item.why_to_ask ||\n          item.whyToAsk ||\n          item.rationale ||\n          "";\n\n        const priority =\n          item.priority ||\n          item.severity ||\n          "";\n\n        return [\n          `#### ${index + 1}. ${question}`,\n          priority ? `**Priority:** ${priority}` : "",\n          whyToAsk ? `**Why to ask:** ${whyToAsk}` : ""\n        ]\n          .filter(Boolean)\n          .join("\\n\\n");\n      })\n      .join("\\n\\n---\\n\\n");\n  })()\n}}'
      }
      verticalAlign="center"
    />
    <Text
      id="reviewSuggestedRewritesText"
      value={
        '{{\n  (() => {\n    const parseMaybeJson = value => {\n      if (!value) return null;\n      if (typeof value === "object") return value;\n\n      if (typeof value === "string") {\n        try {\n          return JSON.parse(value);\n        } catch {\n          return null;\n        }\n      }\n\n      return null;\n    };\n\n    const storedResult =\n      getGovernanceReviewResult.data?.result_json?.[0] ||\n      getGovernanceReviewResult.data?.[0]?.result_json ||\n      null;\n\n    const result =\n      runGovernanceReviewFlow.data?.result ||\n      runGovernanceReviewFlow.data?.display ||\n      runGovernanceReviewFlow.data?.display_model ||\n      parseMaybeJson(storedResult) ||\n      {};\n\n    const rewrites =\n      result.suggested_rewrites ||\n      result.suggestedRewrites ||\n      result.rewrites ||\n      [];\n\n    if (!Array.isArray(rewrites) || rewrites.length === 0) {\n      return "No suggested rewrites returned.";\n    }\n\n    return rewrites\n      .map((item, index) => {\n        const targetSection =\n          item.target_section ||\n          item.targetSection ||\n          item.section ||\n          `Rewrite ${index + 1}`;\n\n        const currentIssue =\n          item.current_issue ||\n          item.currentIssue ||\n          item.issue ||\n          "";\n\n        const suggestedRewrite =\n          item.suggested_rewrite ||\n          item.suggestedRewrite ||\n          item.rewrite ||\n          item.replacement_text ||\n          "";\n\n        return [\n          `#### ${index + 1}. ${targetSection}`,\n          currentIssue ? `**Current issue:** ${currentIssue}` : "",\n          suggestedRewrite ? `**Suggested rewrite:**\\n\\n${suggestedRewrite}` : ""\n        ]\n          .filter(Boolean)\n          .join("\\n\\n");\n      })\n      .join("\\n\\n---\\n\\n");\n  })()\n}}'
      }
      verticalAlign="center"
    />
    <Text
      id="reviewQualityFlagsText"
      value={
        '{{\n  (() => {\n    const parseMaybeJson = value => {\n      if (!value) return null;\n      if (typeof value === "object") return value;\n\n      if (typeof value === "string") {\n        try {\n          return JSON.parse(value);\n        } catch {\n          return null;\n        }\n      }\n\n      return null;\n    };\n\n    const storedResult =\n      getGovernanceReviewResult.data?.result_json?.[0] ||\n      getGovernanceReviewResult.data?.[0]?.result_json ||\n      null;\n\n    const result =\n      runGovernanceReviewFlow.data?.result ||\n      runGovernanceReviewFlow.data?.display ||\n      runGovernanceReviewFlow.data?.display_model ||\n      parseMaybeJson(storedResult) ||\n      {};\n\n    const flags =\n      result.quality_flags ||\n      result.qualityFlags ||\n      result.flags ||\n      [];\n\n    if (!Array.isArray(flags) || flags.length === 0) {\n      return "No quality flags returned.";\n    }\n\n    return flags\n      .map((item, index) => {\n        const flag =\n          item.flag ||\n          item.title ||\n          item.finding ||\n          `Quality flag ${index + 1}`;\n\n        const category =\n          item.category ||\n          "";\n\n        const severity =\n          item.severity ||\n          item.priority ||\n          "";\n\n        const explanation =\n          item.explanation ||\n          item.rationale ||\n          item.reason ||\n          "";\n\n        return [\n          `#### ${index + 1}. ${flag}`,\n          category ? `**Category:** ${category}` : "",\n          severity ? `**Severity:** ${severity}` : "",\n          explanation ? `**Explanation:** ${explanation}` : ""\n        ]\n          .filter(Boolean)\n          .join("\\n\\n");\n      })\n      .join("\\n\\n---\\n\\n");\n  })()\n}}'
      }
      verticalAlign="center"
    />
    <Text
      id="reviewEvidenceFindingsText"
      value={
        '{{\n  (() => {\n    const parseMaybeJson = value => {\n      if (!value) return null;\n      if (typeof value === "object") return value;\n\n      if (typeof value === "string") {\n        try {\n          return JSON.parse(value);\n        } catch {\n          return null;\n        }\n      }\n\n      return null;\n    };\n\n    const storedResult =\n      getGovernanceReviewResult.data?.result_json?.[0] ||\n      getGovernanceReviewResult.data?.[0]?.result_json ||\n      null;\n\n    const result =\n      runGovernanceReviewFlow.data?.result ||\n      runGovernanceReviewFlow.data?.display ||\n      runGovernanceReviewFlow.data?.display_model ||\n      parseMaybeJson(storedResult) ||\n      {};\n\n    const findings =\n      result.evidence_findings ||\n      result.evidenceFindings ||\n      result.evidence ||\n      [];\n\n    if (!Array.isArray(findings) || findings.length === 0) {\n      return "No evidence findings returned.";\n    }\n\n    return findings\n      .map((item, index) => {\n        const finding =\n          item.finding ||\n          item.claim ||\n          item.title ||\n          `Evidence finding ${index + 1}`;\n\n        const evidenceBasis =\n          item.evidence_basis ||\n          item.evidenceBasis ||\n          item.evidence_state ||\n          item.evidenceState ||\n          "";\n\n        const quoteOrReference =\n          item.quote_or_reference ||\n          item.quoteOrReference ||\n          item.reference ||\n          item.basis ||\n          "";\n\n        const implication =\n          item.implication ||\n          item.risk_if_unconfirmed ||\n          item.riskIfUnconfirmed ||\n          item.what_to_confirm_next ||\n          "";\n\n        return [\n          `#### ${index + 1}. ${finding}`,\n          evidenceBasis ? `**Evidence basis:** ${evidenceBasis}` : "",\n          quoteOrReference ? `**Reference:** ${quoteOrReference}` : "",\n          implication ? `**Implication:** ${implication}` : ""\n        ]\n          .filter(Boolean)\n          .join("\\n\\n");\n      })\n      .join("\\n\\n---\\n\\n");\n  })()\n}}'
      }
      verticalAlign="center"
    />
    <Container
      id="containerCopyInformationButtons"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
    >
      <Header>
        <Text
          id="containerTitle10"
          value="#### Container title"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Button
          id="copyFullReviewButton"
          disabled="{{ !runGovernanceReviewFlow.data?.display?.copy_full_review && !runGovernanceReviewFlow.data?.result?.copy_full_review }}"
          text="Copy full review to Clipboard"
        >
          <Event
            id="f1dc3dbd"
            event="click"
            method="run"
            params={{
              map: {
                src: 'const text =\n  runGovernanceReviewFlow.data?.display?.copy_full_review ||\n  runGovernanceReviewFlow.data?.result?.copy_full_review ||\n  "";\n\nif (!text.trim()) {\n  utils.showNotification({\n    title: "Nothing to copy",\n    description: "No full review is available yet.",\n    notificationType: "warning"\n  });\n\n  return;\n}\n\nutils.copyToClipboard(text);\n\nutils.showNotification({\n  title: "Full review copied",\n  description: "The full governance review has been copied to your clipboard.",\n  notificationType: "success"\n});',
              },
            }}
            pluginId=""
            type="script"
            waitMs="0"
            waitType="debounce"
          />
        </Button>
        <Button
          id="copyGovernanceReviewButton"
          disabled={
            '{{ !(\n  governanceReviewExportResultState.value?.copy_full_review ||\n  runGovernanceReviewFlow.data?.copy_full_review ||\n  runGovernanceReviewFlow.data?.markdown ||\n  ""\n).trim() }}'
          }
          text="Copy Review"
        >
          <Event
            id="64beed12"
            event="click"
            method="trigger"
            params={{}}
            pluginId="copyGovernanceReviewMarkdown"
            type="datasource"
            waitMs="0"
            waitType="debounce"
          />
        </Button>
      </View>
    </Container>
  </View>
</Container>
