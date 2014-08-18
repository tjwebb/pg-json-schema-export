pg-json-schema-export
=====================

[![Build Status](https://travis-ci.org/tjwebb/pg-json-schema-export.svg)](https://travis-ci.org/tjwebb/pg-json-schema-export)
[![NPM version](https://badge.fury.io/js/pg-json-schema-export.svg)](http://badge.fury.io/js/pg-json-schema-export)
[![Dependency Status](https://david-dm.org/tjwebb/pg-json-schema-export.svg)](https://david-dm.org/tjwebb/pg-json-schema-export)

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

## Output Format
The output format is for the most part named after the columns in [`information_schema`](http://www.postgresql.org/docs/9.3/static/information-schema.html).

#### Structure
- schemas
  - views
    - columns
  - tables
    - columns
  - sequences


#### JSON
```json
{
  "public": {
    "tables": {
      "user": {
        "obj_description": "This table has Users in it",
        "columns": {
          "name: {
            "data_type": "text",
            ...
          }
        }
      },
      ...
    },
    "views": {
      ...
    },
    "sequences": {

    }
```
I auto-generate some JSON during each CI build; those are uploaded as Github releases: https://github.com/tjwebb/pg-json-schema-export/releases/latest



## More Info
- unit tests: https://github.com/tjwebb/pg-json-schema-export/blob/master/test.js
- npm: https://www.npmjs.org/package/pg-json-schema-export
- travis-ci: https://travis-ci.org/tjwebb/pg-json-schema-export
- github: https://github.com/tjwebb/pg-json-schema-export
- license: MIT
