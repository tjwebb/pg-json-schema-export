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
    this.timeout(process.env.TRAVIS ? 60 * 1000 : 20000);

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
      it('public.tables.cashrcpt.columns.cashrcpt_notes', function () {
        assert(_.isObject(schema.public.tables));
        assert(_.isObject(schema.public.tables.cashrcpt));
        assert(_.isObject(schema.public.tables.cashrcpt.columns.cashrcpt_notes));
      });
      it('public.tables.atlasmap.columns.atlasmap_headerline.col_description', function () {
        assert(_.isString(schema.public.tables.atlasmap.columns.atlasmap_headerline.col_description));
      });
      it('api.views.accountfile.columns.crmacct_id.data_type', function () {
        assert(_.isString(schema.api.views.accountfile.columns.crmacct_id.data_type));
      });
    });

  });

});
