-- Fetches Complexity Level options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  "complexity_level" as label,
  complexity_level
from os_complexity_levels
order by "id";