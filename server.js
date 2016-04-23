// Modules
var http = require('http'),
    router = require('./router.js');

// server
var server = http.createServer(),
    port = 8080;

// events
server.on('request', router.dispatch.bind(router));

// log
console.log('Max is running..');

// init
server.listen(port);
