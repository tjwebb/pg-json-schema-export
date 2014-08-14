select
  view_schema,
  view_name,
  column_name,
  column_default,
  is_nullable,
  is_updatable,
  is_trigger_updatable,
  is_insertable_into,
  is_trigger_insertable_into,
  is_trigger_deletable,
  data_type,
  ordinal_position,
  col_description((view_schema || '.' || view_name)::regclass, ordinal_position),
  obj_description((view_schema || '.' || view_name)::regclass, 'pg_class'),
  constraint_name as fkey,
  unique_constraint_name as pkey

from information_schema.columns
natural full join information_schema.constraint_column_usage
natural full join information_schema.key_column_usage
natural full join information_schema.referential_constraints
natural full join information_schema.view_column_usage
natural full join information_schema.views

where view_schema not in ('information_schema', 'pg_catalog')
order by view_name
