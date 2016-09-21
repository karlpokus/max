var http = require('http'),
    router = require('./router.js'),
    server = http.createServer(),
    port = process.env.PORT || 8080;

server.on('request', router.dispatch.bind(router));
console.log('Max is running..');
server.listen(port);