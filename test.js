var assert = require('assert');
var _ = require('lodash');
var pgSchema = require('./');

describe('pg-json-schema-export', function () {
  var options = {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DATABASE || 'postgres',
    port: process.env.POSTGRES_PORT || 5432
  };

  describe('#toJSON', function () {
    var schema;
    before(function (done) {
      pgSchema.toJSON(options, function (err, _schema) {
        schema = _schema;
        done(err);
      });
    });

    it('should return an object', function () {
      assert(_.isObject(schema));
      console.log(JSON.stringify(schema, null, 2));
    });

    describe('can access specific columns with js dot-notation', function () {
      it('public.cashrcpt.cashrcpt_notes', function () {
        assert(_.isObject(schema.public));
        assert(_.isObject(schema.public.cashrcpt));
        assert(_.isObject(schema.public.cashrcpt.cashrcpt_notes));
      });
    });

  });

});
