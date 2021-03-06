const http = require('http');
const app = require('./config/express')();
const database = require('./config/database.js');
const init = require('./init');

database();
init();

const server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Express is running on port now ' + app.get('port'));
});

module.exports = server;
