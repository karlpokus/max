var http = require('http'),
    server = http.createServer(),
    //router = require('./router.js'),
    pype = require('pype-stack'),
    dataparser = require('./lib/dataparser'),
    attachBot = require('./lib/attachBot'),
    checkOrigin = require('./lib/checkOrigin'),
    logger = require('./lib/logger'),
    botAction = require('./lib/botAction'),
    stack = [dataparser, attachBot, checkOrigin, logger, botAction],
    errorHandler = function(err, req, res){
      console.error(err);
      res.statusCode = 200;
      res.end();
    },
    finalHandler = function(req, res){
      res.statusCode = 200;
      res.end();
    },
    port = process.env.PORT || 8080;

server.on('request', function(req, res){

  if (req.method === 'HEAD') {
    res.statusCode = 200;
    res.end();
  }
  if (req.method === 'POST') {
    pype(null, stack, errorHandler, finalHandler)(req, res);
  }
  if (req.method !== 'POST' || req.method === 'HEAD') {
    res.statusCode = 403;
    res.end();
  }

});

server.listen(port, function(){
  console.log('Max is running..');
});
