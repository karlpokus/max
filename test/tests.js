// server must be running!

var test = require('tape'),
    r = require('request'),
    url = "http://node-playground-178080.nitrousapp.com:8080/";


test('http', function(t){

  t.plan(4);

  r({url: url, method: 'HEAD'}, function (err, res) {
    t.equal(res.statusCode, 200, 'HEAD');
  });

  r({url: url, method: 'POST'}, function (err, res) {
    t.equal(res.statusCode, 200, 'POST with empty string as data');
  });

  r({
    url: url,
    method: 'POST',
    json: true,
    body: JSON.stringify({cat: 'bixa'}),
    headers: {
      "x-trello-webhook": 'temp'
    }
  }, function (err, res) {
    t.equal(res.statusCode, 200, 'POST with data');
  });

  r({url: url, method: 'GET'}, function (err, res) {
    t.equal(res.statusCode, 403, 'GET');
  });

});
