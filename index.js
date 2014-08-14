'use strict';

var _ = require('lodash');
var sql = require('./sql');
var pg = require('pg.js');

/**
 * Export a pg schema to json.
 *
 * @param options
 * @param cb
 * @returns {
 *  'schemaA': {
 *    'table1': {
 *      'column1: {
 *        'data_type': 'text',
 *        'is_nullable': true,
 *        ...
 *      }
 *    }
 *  }
 * }
 */
exports.toJSON = function (options, cb) {
  if (!_.isFunction(cb)) throw new TypeError('callback must be provided');

  var client = new pg.Client(options);
  client.connect();

  var database = client.query(sql.database, function (err, result) {
    client.end();
    cb(err, !err && buildDatabaseSchema(result.rows));
  });

};

function buildDatabaseSchema (rows) {
  var schemas = _.transform(_.groupBy(rows, 'table_schema'), function (schema, tables, schemaName) {
    schema[schemaName] = _.transform(_.groupBy(tables, 'table_name'), function (table, columns, tableName) {
      table[tableName] = _.groupBy(columns, 'column_name');
    });
  });

  return schemas;
}
