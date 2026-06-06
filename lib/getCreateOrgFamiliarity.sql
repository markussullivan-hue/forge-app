-- Fetches Organisational Familiarity Level options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  "org_familiarity" as label,
  org_familiarity
from os_org_familiarity
order by "id";