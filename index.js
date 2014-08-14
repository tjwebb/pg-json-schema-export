'use strict';

var _ = require('lodash');
var fs = require('fs');
var getAllSchemas = fs.readFileSync('./sql/all_schemas.sql').toString();

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

  return knex.raw(getAllSchemas)
    .then(function (result) {
      return transformSchema(result.rows);
    })
    .then(function (schemas, tableCommentSchema) {
      return _.merge(schemas, transformSchema(tableCommentSchema));
    });
};

/**
 * Don't look at this function. It transforms stuff.
 */
function transformSchema (rows) {
  return _.transform(_.groupBy(_.compact(rows), 'table_schema'), function (schema, tables, schemaName) {
    schema[schemaName] = _.transform(
      _.groupBy(_.compact(tables), 'table_name'), function (table, columns, tableName) {
        table[tableName] = _.transform(
          _.groupBy(_.compact(columns), 'column_name'), function (column, properties, columnName) {
            delete properties.obj_description;
            column[columnName] = properties[0];
          });
      });
  });
}
