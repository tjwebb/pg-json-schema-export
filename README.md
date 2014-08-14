pg-json-schema-export
=====================

[![Build Status](https://travis-ci.org/tjwebb/pg-json-schema-export.svg)](https://travis-ci.org/tjwebb/pg-json-schema-export)

Export a Postgres schema as JSON

## Install
```sh
$ npm install pg-json-schema-export --save
```

## Usage
```js
var PostgresSchema = require('pg-json-schema-export');
var connection =
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5432,
  database: 'thedb'
};
PostgresSchema.toJSON(connection)
  .then(function (schemas) {
    // handle json object
  })
  .catch(function (error) {
    // handle error
  });
```

## More Info
- Unit tests: https://github.com/tjwebb/pg-json-schema-export/blob/master/test.js
- npm: https://www.npmjs.org/package/pg-json-schema-export
- github: https://github.com/tjwebb/pg-json-schema-export
- License: MIT
