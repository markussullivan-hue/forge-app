-- Fetches Confidence Level options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  "confidence" as label,
  confidence
from os_confidence
order by "id";