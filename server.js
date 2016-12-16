var http = require('http'),
    server = http.createServer(),
    port = process.env.PORT || 8080,
    max = require('./lib/bot');

server
  .on('request', function(req, res){
    if (req.method === 'HEAD') {
      res.statusCode = 200;
      res.end();
    } else if (req.method === 'POST') {
      max.emit('request', req, res);
    } else {
      res.statusCode = 403;
      res.end();
    }
  })
  .listen(port, function(){
    max.emit('log', 'Max is running..');
  });