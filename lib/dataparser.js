module.exports = function(req, res, next) {
  var data = '';
  
  req
    .on('error', next)
    .on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      if (data === '') {
        return next('Webhook payload empty');
      }
      
      req.body = data;
      return next();      
    });
}