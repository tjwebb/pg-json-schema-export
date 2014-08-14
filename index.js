'use strict';

var _ = require('lodash');
var sql = require('./sql');

/**
 * Export a pg schema to json.
 *
 * @param connection
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
exports.toJSON = function (connection) {
  var knex = require('knex')({ client: 'pg', connection: connection });

  return knex.raw(sql.getAllSchemas)
    .then(function (result) {
      return [
        transformSchema(result.rows),
        knex.raw(sql.getTableComments)
      ];
    })
    .spread(function (schemas, tableCommentSchema) {
      return _.merge(schemas, transformSchema(tableCommentSchema));
    });
};

function transformSchema (rows) {
  return _.transform(_.groupBy(rows, 'table_schema'), function (schema, tables, schemaName) {
    schema[schemaName] = _.transform(_.groupBy(tables, 'table_name'), function (table, columns, tableName) {
      table[tableName] = _.transform(_.groupBy(columns, 'column_name'), function (column, properties, columnName) {
        column[columnName] = properties[0];
      });
    });
  });
}
