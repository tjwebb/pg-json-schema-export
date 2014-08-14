select
  sequence_schema,
  sequence_name,
  data_type,
  start_value,
  minimum_value,
  maximum_value,
  increment,
  cycle_option
  
from information_schema.sequences

where sequence_schema not in ('information_schema', 'pg_catalog')
order by sequence_schema
