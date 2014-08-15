select
  table_schema,
  table_name,
  column_name,
  column_default,
  is_nullable,
  data_type,
  ordinal_position,
  col_description((table_schema || '.' || table_name)::regclass, ordinal_position),
  obj_description((table_schema || '.' || table_name)::regclass, 'pg_class'),
  constraint_name,
  constraint_type,
  unique_constraint_name,
  position_in_unique_constraint

from information_schema.columns
natural full join information_schema.constraint_column_usage
natural full join information_schema.key_column_usage
natural full join information_schema.referential_constraints
natural full join information_schema.table_constraints

where table_schema not in ('information_schema', 'pg_catalog')
and column_name is not null
order by table_name
