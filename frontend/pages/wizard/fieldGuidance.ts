// Single source of truth for wizard field guidance.
// Ported from the classic app's per-widget tooltips. Keyed by the React
// wizard-state key / input id so <FieldGuidance id="..."> can look it up.
// To add/edit guidance, change this file only.

export type FieldGuidanceEntry = {
  /** Plain-English help shown under the field. */
  help: string
  /** Optional suggested prompt for ChatGPT / Claude. Omit if none. */
  prompt?: string
}

export const FIELD_GUIDANCE: Record<string, FieldGuidanceEntry> = {
  // --- Step 1: Initiative Overview ---
  initiativeName: {
    help: 'Enter a short, recognisable name for the initiative. Use business language first, not internal jargon. A good name should make it obvious what is changing.',
    prompt: 'Give me 10 clear project names for an IT initiative about "topic".',
  },
  initiativeDescription: {
    help: 'Write 1 to 3 sentences explaining what the initiative is, who it helps, and what it is expected to achieve. Keep it plain-English and avoid buzzwords.',
    prompt: 'Help me write a concise project summary for an intake form. Ask me 3 questions first.',
  },
  initiativeBudget: {
    help: 'Enter an estimated total budget based on current knowledge (including delivery, resources, vendors, and contingency). No need for precision — a directional estimate is enough at this stage.',
    prompt: 'Estimate a project budget for a "[project type]" IT initiative with "[scope/components]" and "[timeline]".',
  },
  initiativeTargetStartDate: {
    help: 'Choose the realistic date the initiative can begin, allowing for approvals, funding, people, and dependencies.',
    prompt: 'What should I consider when estimating a realistic project start date?',
  },
  initiativeTargetEndDate: {
    help: 'Choose the date by which the main outcome should be delivered. Consider milestones, dependencies, blackout periods, and business deadlines.',
    prompt: 'Help me think through a realistic target end date for a project about <topic>.',
  },

  // --- Step 2: Context & Systems ---
  textInputStrategicObjectives: {
    help: 'Explain the end state you want, not just the activity. Focus on the business result, such as improved speed, lower risk, better controls, better customer experience, reduced cost, stronger reporting, or higher capacity.',
    prompt: 'Help me turn a business problem into 3 clear project objectives.',
  },
  textInputBusinessProblem: {
    help: 'Describe the problem that exists today. Include what is going wrong, who is affected, and why it matters now. Useful themes include cost, delay, risk, compliance, customer impact, manual effort, poor data, missed revenue, or service failure.',
    prompt: 'Help me write a 2-sentence business problem statement for an IT project intake form. Ask me what is happening, who is affected, and why now.',
  },

  // --- Step 2: Dimensions & Scope ---
  radioGroupReadiness: {
    help: 'How prepared is the organisation for this kind of work — based on prior experience and confidence in approach.',
  },
  radioGroupScale: {
    help: 'Choose the overall scale of the initiative. Think about reach, spend, people affected, systems touched, and delivery effort.',
    prompt: 'Help me classify the scale of an IT project affecting <scope>.',
  },
  radioGroupComplexity: {
    help: 'Choose the complexity based on moving parts: number of teams, integrations, dependencies, data issues, vendor involvement, regulation, and uncertainty.',
    prompt: 'Help me assess project complexity for an initiative involving <topic>.',
  },
  multiselectBusinessDrivers: {
    help: 'Choose the main reasons this initiative exists. Examples may include regulatory compliance, cost reduction, customer improvement, risk reduction, operational efficiency, revenue growth, or strategic change.',
    prompt: 'What are the likely business drivers for a project about <topic>?',
  },
  multiselectImpactedFunctions: {
    help: 'Choose the functions that will change, contribute, or feel the impact. This may include Operations, Finance, Risk, Compliance, Customer Service, IT, Data, HR, or Procurement.',
    prompt: 'Which business functions are likely to be impacted by a project about <topic>?',
  },
  selectLifeCycleStage: {
    help: 'Choose the stage that best reflects where the initiative is now, not where you wish it was. Typical stages include idea, discovery, initiation, planning, delivery, transition, or closure.',
    prompt: 'Help me decide the right lifecycle stage for a project that is currently <situation>.',
  },
}
