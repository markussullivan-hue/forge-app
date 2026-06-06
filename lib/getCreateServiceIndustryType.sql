-- Fetches Business driver options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  service_industry_type as label,
  service_industry_type
from os_service_industry_type
order by id;