await materialTypeSelect.setValue("business_case");

await governanceTextInput.setValue(`This project is intended to improve the organisation’s use of technology and support better ways of working across the business. The proposed approach is to develop a solution that will help teams work more efficiently, reduce manual effort, and provide better information for decision-making. The project is expected to involve several teams and will require input from business, technology, governance, and operational stakeholders.

The overall aim is to make improvements to current processes and create a more consistent approach. The current position is that some activities are slow, inconsistent, or difficult to track, and this creates challenges for managers and delivery teams. The project should help address these issues by introducing a better process and supporting tools.

The preferred option is to proceed with the project and begin further planning. The next step will be to confirm the requirements, agree the delivery approach, and work with stakeholders to define what needs to be done. A project team will be identified and governance meetings will be arranged to monitor progress. Risks and issues will be reviewed regularly, and updates will be provided to senior stakeholders when required.

The expected benefits include improved efficiency, clearer reporting, better governance, and reduced manual work. These benefits are expected to support the organisation’s wider objectives and help teams deliver more effectively. Further work will be needed to define the benefits in more detail and agree how they will be measured.

The project will require funding and resources, although the final amount has not yet been confirmed. Costs will be developed during the next stage once the scope and delivery plan are better understood. The project is expected to be delivered in phases, but the detailed timeline has not yet been agreed.

There are some risks, including stakeholder availability, technology complexity, unclear requirements, and possible delays. These risks will be managed through regular project governance and escalation where needed. The project sponsor will provide oversight and ensure that decisions are made at the appropriate level.

Approval is requested to continue with the project and move into the next stage of planning. This will allow the team to develop the business case further, confirm the delivery plan, and prepare a more detailed proposal for review.`);

await reviewInputValidation.trigger();

return {
  materialType: materialTypeSelect.value,
  textLength: String(governanceTextInput.value || "").length,
  validation: reviewInputValidation.data
};