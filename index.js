'use strict';

global.Promise || (global.Promise = require('bluebird'));

var _ = require('lodash');
var fs = require('fs');
var getTableSchemas = fs.readFileSync('./sql/tables.sql').toString();
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
exports.toJSON = function (connection) {
  var knex = require('knex')({ client: 'pg', connection: connection });
  var queries = [
    knex.raw(getSequences),
    knex.raw(getTableSchemas),
    knex.raw(getViewSchemas)
  ];

  return Promise.all(queries)
    .spread(function (sequences, tables, views) {
      return _.merge(
        transform(tables.rows, 'table'),
        transform(views.rows, 'view'),
        transform(sequences.rows, 'sequence')
      );
    });
};

/**
 * Don't look at this function. It transforms stuff.
 */
function transform (rows, type) {
  return _.transform(
    _.groupBy(rows, type + '_schema'), function (schema, objects, schemaName) {
      schema[schemaName] = { };
      schema[schemaName][type + 's'] = _.transform(
        _.groupBy(objects, type + '_name'), function (object, columns, objectName) {
          object[objectName] = {
            obj_description: columns[0].obj_description
          };
          if (type === 'sequence') _.extend(object[objectName], columns[0]);
          else object[objectName].columns = _.transform(
            _.groupBy(columns, 'column_name'), function (column, properties, columnName) {
              delete properties[0].obj_description;
              column[columnName] = properties[0];
            });
        });
    });
}
