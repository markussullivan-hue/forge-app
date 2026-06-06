-- Test helper: validates the data shape of a returning insert for projects without persisting anything (inserts then rolls back).
begin;

insert into projects (
  org_id,
  project_code,
  project_name,
  pipeline_stage,
  status,
  delivery_maturity,
  regulatory_intensity
)
values (
  (select org_id from organisations limit 1),
  'RT-PREVIEW-SHAPE',
  'Preview createProject return shape',
  'Not Started',
  'Initiation',
  'Moderate',
  'Medium'
)
returning project_id;

rollback;