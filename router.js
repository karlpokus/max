// modules
var max = require('./lib/bot.js');

var router = {
  dispatch: function(req, res) {

    // head or post
    if (req.method === 'HEAD' || req.method === 'POST') {

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

        req.body = data;
        that.passOnToBot(req);

      }

    });
  },
  passOnToBot: function(req) {

    var data = JSON.parse(req.body);

    if (max.originIsTrello(req)) {

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
