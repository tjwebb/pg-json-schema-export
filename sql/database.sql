select
  table_schema,
  table_name,
  column_name,
  column_default,
  is_nullable,
  data_type
  
from information_schema.columns
where table_schema not in ('information_schema', 'pg_catalog')
order by table_name
