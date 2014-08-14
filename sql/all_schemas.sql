select
  table_schema,
  table_name,
  column_name,
  column_default,
  is_nullable,
  data_type,
  ordinal_position,
  col_description((table_schema || '.' || table_name)::regclass, ordinal_position),
  obj_description((table_schema || '.' || table_name)::regclass, 'pg_class')
  
from information_schema.columns
where table_schema not in ('information_schema', 'pg_catalog')
order by table_name
