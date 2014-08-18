pg-json-schema-export
=====================

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

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
PostgresSchema.toJSON(connection, 'public')
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
```js
{
  "tables": {
    "user": {
      "obj_description": "This table has Users in it",
      "columns": {
        "name": {
          "data_type": "text",
          // ... more columns
        }
      }
    },
    // ... more tables
  },
  "constraints": {
    // column constraints, grouped by table
  },
  "sequences": {
    // column sequences, grouped by table
  }
```
I auto-generate some JSON during each CI build; those are uploaded as Github releases: https://github.com/tjwebb/pg-json-schema-export/releases/latest

## API

#### `.toJSON(connection, schema)`
| parameter | description
|---|---|
`connection` | connection string or object compatible with [`pg`](https://github.com/brianc/node-postgres)
`schema` | the database schema to export


## License
MIT


[npm-image]: https://img.shields.io/npm/v/pg-json-schema-export.svg?style=flat
[npm-url]: https://npmjs.org/package/pg-json-schema-export
[travis-image]: https://img.shields.io/travis/tjwebb/pg-json-schema-export.svg?style=flat
[travis-url]: https://travis-ci.org/tjwebb/pg-json-schema-export
[daviddm-image]: http://img.shields.io/david/tjwebb/pg-json-schema-export.svg?style=flat
[daviddm-url]: https://david-dm.org/tjwebb/pg-json-schema-export
