var fs = require('fs');
var path = require('path');

module.exports = {
  database: fs.readFileSync(path.resolve(__dirname, 'database.sql')).toString()
};
