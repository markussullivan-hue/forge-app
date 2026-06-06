<Container
  id="containerInitiativeOverview"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showHeader={true}
>
  <Header>
    <Text
      id="containerTitle1"
      value="#### Initiative Overview"
      verticalAlign="center"
    />
    <Text
      id="text1"
      value="Capture the basics so we can tailor the charter and artefact generation."
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <TextInput
      id="initiativeName"
      inputTooltip={
        'Enter a short, recognisable name for the initiative. Use business language first, not internal jargon. A good name should make it obvious what is changing.\nNeed ideas? ChatGPT: https://chatgpt.com/\nSuggested prompt: Give me 10 clear project names for an IT initiative about "topic".'
      }
      label="Initiative Name"
      labelPosition="top"
      placeholder="e.g. Claims Platform Upgrade"
      required={true}
    />
    <TextInput
      id="initiativeDescription"
      inputTooltip="Write 1 to 3 sentences explaining what the initiative is, who it helps, and what it is expected to achieve. Keep it plain-English and avoid buzzwords.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Help me write a concise project summary for an intake form. Ask me 3 questions first."
      label="Initiative Purpose"
      labelPosition="top"
      placeholder="A short summary of what this initiative will deliver"
      required={true}
    />
    <NumberInput
      id="initiativeBudget"
      currency="GBP"
      format="currency"
      inputTooltip={
        'Enter an estimated total budget based on current knowledge (including delivery, resources, vendors, and contingency).\nNo need for precision - a directional estimate is enough at this stage.\n\nNeed help? ChatGPT: https://chatgpt.com/\n\nSuggested prompt: Estimate a project budget for a "[project type]" IT initiative with "[scope/components]" and "[timeline]".'
      }
      inputValue={0}
      label="Estimated Budget"
      labelPosition="top"
      placeholder="Enter value"
      required={true}
      showSeparators={true}
      showStepper={true}
      value=""
    />
    <Date
      id="initiativeTargetStartDate"
      customValidation="{{ (() => {
  if (!initiativeTargetStartDate.value) return '';
  const start = new Date(initiativeTargetStartDate.value);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return start < today
    ? 'Start date cannot be earlier than today.'
    : '';
})() }}"
      dateFormat="dd/MM/yyyy"
      datePlaceholder="{{ self.dateFormat.toUpperCase() }}"
      firstDayOfWeek={1}
      iconBefore="bold/interface-calendar"
      label="Target Start Date"
      labelPosition="top"
      minDate="{{ (() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
})() }}"
      required={true}
      tooltipText="Choose the realistic date the initiative can begin, allowing for approvals, funding, people, and dependencies.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: What should I consider when estimating a realistic project start date?"
      value="{{ new Date() }}"
    />
    <Date
      id="initiativeTargetEndDate"
      customValidation="{{ (() => {
  if (!initiativeTargetStartDate.value || !initiativeTargetEndDate.value) return '';

  const start = new Date(initiativeTargetStartDate.value);
  const end = new Date(initiativeTargetEndDate.value);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Add 1 month to start date
  const minEnd = new Date(start);
  minEnd.setMonth(minEnd.getMonth() + 1);

  return end < minEnd
    ? 'Target end date must be at least 1 month after the start date.'
    : '';
})() }}"
      dateFormat="dd/MM/yyyy"
      datePlaceholder="{{ self.dateFormat.toUpperCase() }}"
      firstDayOfWeek={1}
      iconBefore="bold/interface-calendar-alternate"
      label="Target End Date"
      labelPosition="top"
      minDate="{{ (() => {
  if (!initiativeTargetStartDate.value) return null;
  const minEnd = new Date(initiativeTargetStartDate.value);
  minEnd.setHours(0, 0, 0, 0);
  minEnd.setDate(minEnd.getDate() + 1);
  return minEnd;
})() }}"
      required={true}
      tooltipText="Choose the date by which the main outcome should be delivered. Consider milestones, dependencies, blackout periods, and business deadlines.
Need ideas? ChatGPT: https://chatgpt.com/
Suggested prompt: Help me think through a realistic target end date for a project about <topic>."
      value="{{ new Date() }}"
    />
    <Multiselect
      id="initiativeServiceIndustrySelect"
      captionByIndex="{{ item.label ? '' : '' }}"
      data="{{ getCreateServiceIndustryType.data }}"
      emptyMessage="No options"
      label="Service Industry"
      labelPosition="top"
      labels="{{ item.label }}"
      overlayMaxHeight={375}
      placeholder="Select options"
      required={true}
      showSelectionIndicator={true}
      values="{{ item.id }}"
      wrapTags={true}
    />
  </View>
</Container>
