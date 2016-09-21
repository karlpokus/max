// modules
var max = require('./lib/bot.js');

var router = {
  dispatch: function(req, res) {
    if (req.method === 'HEAD' || req.method === 'POST') {

      // debug
      console.log('router.dispatch fired with method:', req.method);
      
      this[req.method](req, res);

    } else {
      res.statusCode = 403;
      res.end();
    }
  },
  HEAD: function(req, res) {
    res.statusCode = 200;
    res.end();
  },
  POST: function(req, res) {
    var data = "",
        that = this;

    req.on('error', function(err) {
      console.error(err);

    }).on('data', function(chunk) {
      data += chunk;

    }).on('end', function() {
      res.statusCode = 200;
      res.end();

      if (data !== "") {
        data = JSON.parse(data);
        
        // debug
        console.log('data:', data);
        
        that.passOnToBot(data, req);
      }
    });
  },
  passOnToBot: function(data, req) {
    if (max.originIsTrello(req)) {

      // debug
      console.log('.originIsTrello is ok');
      
      if (max.actionTypesAreOneOf(['commentCard'], data)) {
        max.kommentarTillBot(data);
        max.ingetAnvändarnamn(data);
      }
      if (max.actionTypesAreOneOf(['createCard', 'updateCard'], data)) {
        max.långTitel(data);
      }
    }
  }
};


module.exports = router;
