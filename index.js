'use strict';

var _ = require('lodash');
var sql = require('./sql');

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
exports.toJSON = function (connection, cb) {
  if (!_.isFunction(cb)) throw new TypeError('callback must be provided');

  var knex = require('knex')({ client: 'pg', connection: connection });

  knex.raw(sql.getAllSchemas)
    .then(function (result) {
      return [
        transformSchema(result.rows),
        knex.raw(sql.getTableComments)
      ];
    })
    .spread(function (schemas, tableCommentSchema) {
      cb(null, _.merge(schemas, transformSchema(tableCommentSchema)));
    })
    .catch(function (error) {
      cb(error);
    });

};

function transformSchema (rows) {
  return _.transform(_.groupBy(rows, 'table_schema'), function (schema, tables, schemaName) {
    schema[schemaName] = _.transform(_.groupBy(tables, 'table_name'), function (table, columns, tableName) {
      table[tableName] = _.groupBy(columns, 'column_name');
    });
  });
}
