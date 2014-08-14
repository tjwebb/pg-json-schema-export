var fs = require('fs');
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
    this.timeout(20000);

    var schema;
    before(function (done) {
      pgSchema.toJSON(options)
        .then(function (_schema) {
          schema = _schema;
          done();
        })
        .catch(done);
    });

    it('should return an object', function () {
      assert(_.isObject(schema));
      fs.writeFileSync('schema_mocha.json', JSON.stringify(schema, null, 2));
    });

    describe('can access specific columns with js dot-notation', function () {
      it('public.tables.cashrcpt.cashrcpt_notes', function () {
        assert(_.isObject(schema.public.tables));
        assert(_.isObject(schema.public.tables.cashrcpt));
        assert(_.isObject(schema.public.tables.cashrcpt.cashrcpt_notes));
      });
      it('public.tables.atlasmap.atlasmap_headerline.col_description', function () {
        assert(_.isString(schema.public.tables.atlasmap.atlasmap_headerline.col_description));
      });
      it('xt.views.act.prjtaskext_priority_id.fkey', function () {
        assert(_.isString(schema.xt.views.act.prjtaskext_priority_id.fkey));
      });
    });

  });

});
