-- Fetches Business driver options for Step 2 (Dimensions) in the Project Intake wizard.
select
  id,
  delivery_type as label,
  delivery_type
from os_delivery_type
order by id;