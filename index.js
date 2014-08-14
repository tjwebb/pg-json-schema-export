'use strict';

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

  return knex.raw(getSequences)
    .then(function (sequenceResult) {
      return [
        transform(sequenceResult.rows, 'sequence'),
        knex.raw(getTableSchemas)
      ];
    })
    .spread(function (sequences, tableSchemas) {
      var table = transform(tableSchemas.rows, 'table');
      return [
        sequences,
        transform(tableSchemas.rows, 'table'),
        knex.raw(getViewSchemas)
      ];
    })
    .spread(function (sequences, tableSchemas, viewSchemas) {
      return _.merge(transform(viewSchemas.rows, 'view'), tableSchemas, sequences);
    });
};

/**
 * Don't look at this function. It transforms stuff.
 */
function transform (rows, type) {
  return _.transform(_.groupBy(rows, type + '_schema'), function (schema, objects, schemaName) {
    schema[schemaName] || (schema[schemaName] = { });
    schema[schemaName][type + 's'] = _.transform(
      _.groupBy(objects, type + '_name'), function (object, columns, objectName) {
        object[objectName] = _.transform(
          _.groupBy(columns, 'column_name'), function (column, properties, columnName) {
            delete properties.obj_description;
            column[columnName] = properties[0];
          });
      });
  });
}
