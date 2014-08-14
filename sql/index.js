var fs = require('fs');
var path = require('path');

module.exports = {
  getAllSchemas: fs.readFileSync(path.resolve(__dirname, 'all_schemas.sql')).toString(),
  getTableComments: fs.readFileSync(path.resolve(__dirname, 'table_comments.sql')).toString()
};
