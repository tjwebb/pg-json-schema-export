var assert = require('assert');
var _ = require('lodash');
var pgSchema = require('./');

describe('pg-json-schema-export', function () {
  var options = {
    user: 'alpha',
    password: 'test',
    database: 'demo_pilot',
    host: 'localhost',
    port: 5434
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
      console.log(JSON.stringify(schema, null, 2));
      assert(_.isObject(schema));
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
