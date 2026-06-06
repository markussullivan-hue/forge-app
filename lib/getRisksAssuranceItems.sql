-- Dashboard: Risks & Assurance table (open risks only; no assurance table exists yet). Read-only.
-- Dashboard: Risks & Assurance (read-only)
-- Conservative implementation:
-- - No assurance table exists in current schema.
-- - This query returns *risk* records only, with item_type = 'Risk'.
--
-- Schema alignment notes:
-- - risks.risk_event does not exist; using risks.risk_title / risks.risk_description instead.
-- - risks.severity / risks.risk_rating / risks.impact (text) do not exist; using numeric risk_score/impact_score/likelihood_score as a simple severity proxy.
-- - risks.owner_role / risks.owner / risks.assigned_to do not exist; returning empty owner.
--   TODO: join mitigation_owner_user_id to users/user profile once required.

with org_scope as (
  select nullif({{ currentOrgIdState.value }}, '')::uuid as org_id
)
select
  r.risk_id,
  r.project_id,
  coalesce(p.project_name, 'Unknown project') as project_name,
  'Risk'::text as item_type,
  coalesce(nullif(trim(r.risk_title), ''), nullif(trim(r.risk_description), ''), 'Risk item') as risk_or_assurance_item,
  (
    case
      when r.risk_score is not null then r.risk_score::text
      when r.impact_score is not null then r.impact_score::text
      when r.likelihood_score is not null then r.likelihood_score::text
      else ''
    end
  ) as severity,
  ''::text as owner,
  coalesce(r.status, 'Open') as status,
  coalesce(r.updated_at, r.created_at) as updated_at
from risks r
cross join org_scope os
left join projects p
  on p.project_id = r.project_id
 and p.org_id = r.org_id
where r.org_id = os.org_id
  and lower(coalesce(r.status, 'open')) not in ('closed', 'resolved', 'cancelled')
order by
  -- Best-effort ordering: higher risk_score first (NULLS LAST), then most recently updated.
  r.risk_score desc nulls last,
  coalesce(r.updated_at, r.created_at) desc
limit 10;