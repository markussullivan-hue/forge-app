with table_list as (
  select
    t.table_schema,
    t.table_name
  from information_schema.tables t
  where t.table_schema = 'public'
    and t.table_type = 'BASE TABLE'
),

columns_json as (
  select
    c.table_name,
    jsonb_agg(
      jsonb_build_object(
        'column_name', c.column_name,
        'ordinal_position', c.ordinal_position,
        'data_type', c.data_type,
        'udt_name', c.udt_name,
        'is_nullable', c.is_nullable,
        'column_default', c.column_default,
        'character_maximum_length', c.character_maximum_length
      )
      order by c.ordinal_position
    ) as columns
  from information_schema.columns c
  where c.table_schema = 'public'
  group by c.table_name
),

constraints_json as (
  select
    tc.table_name,
    jsonb_agg(
      jsonb_build_object(
        'constraint_name', tc.constraint_name,
        'constraint_type', tc.constraint_type,
        'columns',
          (
            select jsonb_agg(kcu.column_name order by kcu.ordinal_position)
            from information_schema.key_column_usage kcu
            where kcu.table_schema = tc.table_schema
              and kcu.table_name = tc.table_name
              and kcu.constraint_name = tc.constraint_name
          ),
        'check_clause', cc.check_clause
      )
      order by tc.constraint_type, tc.constraint_name
    ) as constraints
  from information_schema.table_constraints tc
  left join information_schema.check_constraints cc
    on cc.constraint_schema = tc.constraint_schema
   and cc.constraint_name = tc.constraint_name
  where tc.table_schema = 'public'
  group by tc.table_name
),

foreign_keys_json as (
  select
    tc.table_name,
    jsonb_agg(
      jsonb_build_object(
        'constraint_name', tc.constraint_name,
        'source_columns',
          (
            select jsonb_agg(kcu.column_name order by kcu.ordinal_position)
            from information_schema.key_column_usage kcu
            where kcu.table_schema = tc.table_schema
              and kcu.table_name = tc.table_name
              and kcu.constraint_name = tc.constraint_name
          ),
        'target_table', ccu.table_name,
        'target_column', ccu.column_name
      )
      order by tc.constraint_name
    ) as foreign_keys
  from information_schema.table_constraints tc
  join information_schema.constraint_column_usage ccu
    on ccu.constraint_schema = tc.constraint_schema
   and ccu.constraint_name = tc.constraint_name
  where tc.table_schema = 'public'
    and tc.constraint_type = 'FOREIGN KEY'
  group by tc.table_name
),

indexes_json as (
  select
    schemaname,
    tablename as table_name,
    jsonb_agg(
      jsonb_build_object(
        'indexname', indexname,
        'indexdef', indexdef
      )
      order by indexname
    ) as indexes
  from pg_indexes
  where schemaname = 'public'
  group by schemaname, tablename
),

row_estimates as (
  select
    relname as table_name,
    n_live_tup as estimated_rows
  from pg_stat_user_tables
),

schema_snapshot as (
  select
    jsonb_agg(
      jsonb_build_object(
        'table_name', tl.table_name,
        'estimated_rows', coalesce(re.estimated_rows, 0),
        'columns', coalesce(cj.columns, '[]'::jsonb),
        'constraints', coalesce(conj.constraints, '[]'::jsonb),
        'foreign_keys', coalesce(fkj.foreign_keys, '[]'::jsonb),
        'indexes', coalesce(ij.indexes, '[]'::jsonb)
      )
      order by tl.table_name
    ) as tables
  from table_list tl
  left join columns_json cj
    on cj.table_name = tl.table_name
  left join constraints_json conj
    on conj.table_name = tl.table_name
  left join foreign_keys_json fkj
    on fkj.table_name = tl.table_name
  left join indexes_json ij
    on ij.table_name = tl.table_name
  left join row_estimates re
    on re.table_name = tl.table_name
),

artefact_types_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(t) order by t.display_order nulls last, t.type_code), '[]'::jsonb) as data
  from artefact_types t
),

projects_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc nulls last), '[]'::jsonb) as data
  from (
    select *
    from projects
    order by created_at desc nulls last
    limit 10
  ) x
),

project_context_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.updated_at desc nulls last), '[]'::jsonb) as data
  from (
    select *
    from project_context
    order by updated_at desc nulls last
    limit 10
  ) x
),

generation_runs_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc nulls last), '[]'::jsonb) as data
  from (
    select *
    from generation_runs
    order by created_at desc nulls last
    limit 10
  ) x
),

artefact_versions_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.generated_at desc nulls last), '[]'::jsonb) as data
  from (
    select *
    from artefact_versions
    order by generated_at desc nulls last
    limit 20
  ) x
),

os_options_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.option_set_code, x.display_order nulls last, x.option_label), '[]'::jsonb) as data
  from (
    select *
    from os_options
    order by option_set_code, display_order nulls last, option_label
  ) x
),

delivery_model_groups_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.group_code), '[]'::jsonb) as data
  from (
    select *
    from delivery_model_groups
    order by group_code
  ) x
),

delivery_models_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.model_code), '[]'::jsonb) as data
  from (
    select *
    from delivery_models
    order by model_code
  ) x
),

governance_matrix_snapshot as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.tier_level nulls last, x.tier_code), '[]'::jsonb) as data
  from (
    select *
    from governance_matrix
    order by tier_level nulls last, tier_code
  ) x
)

select jsonb_pretty(
  jsonb_build_object(
    'captured_at', now(),
    'schema', (select tables from schema_snapshot),
    'reference_data', jsonb_build_object(
      'artefact_types', (select data from artefact_types_snapshot),
      'os_options', (select data from os_options_snapshot),
      'delivery_model_groups', (select data from delivery_model_groups_snapshot),
      'delivery_models', (select data from delivery_models_snapshot),
      'governance_matrix', (select data from governance_matrix_snapshot)
    ),
    'recent_data', jsonb_build_object(
      'projects', (select data from projects_snapshot),
      'project_context', (select data from project_context_snapshot),
      'generation_runs', (select data from generation_runs_snapshot),
      'artefact_versions', (select data from artefact_versions_snapshot)
    )
  )
) as forge_database_snapshot;