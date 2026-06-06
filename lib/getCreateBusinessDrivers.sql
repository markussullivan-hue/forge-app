-- Fetches Business driver options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  busines_driver as label,
  code
from os_business_driver
order by id;