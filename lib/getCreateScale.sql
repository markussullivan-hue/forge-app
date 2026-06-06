-- Fetches Scale options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  "scale" as label,
  scale
from os_scale
order by "id";