var express = require('express');

var server = express();

server.use(express.static(__dirname + '/../client'));
require('./routes.js')(server, express);

server.listen(6565);

console.log('server listening on 6565');
