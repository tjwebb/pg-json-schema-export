'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');
var sql = require('./sql');
var getViewSchemas = fs.readFileSync('./sql/views.sql').toString();
var getSequences = fs.readFileSync('./sql/sequences.sql').toString();

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
exports.toJSON = function (connection, schema) {
  var knex = require('knex')({ client: 'pg', connection: connection });
  var queries = [
    knex.raw(sql.getSequences, [schema]),
    knex.raw(sql.getColumns, [schema]),
    knex.raw(sql.getTables, [schema]),
    knex.raw(sql.getConstraints, [schema])
  ];

  return Promise.all(queries)
    .spread(function (sequences, columns, tables, constraints) {
      var columnGroups = _.groupBy(columns.rows, 'table_name');
      return {
        tables: _.transform(_.indexBy(tables.rows, 'table_name'), function (result, table, name) {
          result[name] = _.extend(table, {
            columns: _.indexBy(columnGroups[name], 'column_name')
          });
        }),
        constraints: _.indexBy(constraints.rows, 'table_name'),
        sequences: _.indexBy(sequences.rows, 'sequence_name')
      };
    });
};
