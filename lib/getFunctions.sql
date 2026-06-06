-- Fetches Function options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  "function" as label,
  code
from os_function
order by "function";