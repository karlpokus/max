// set dummy env vars
process.env.KEY = 'dummy key';
process.env.TOKEN = 'dummy token';
process.env.USERID = '123456';
process.env.USERNAME = 'maxblipblop';

var test = require('tape'),
    max = require('../lib/bot.js');

// overwrite postcomment for testing purposes
max.postComment = function(cardId, answer) {
  return answer;
}

test('kommentarTillBot', function(t){
  var data = {
    action: {
      data: {
        text: '@maxblipblop vem är sekreterare på vug',
        card: {id: 'cardId'}
      },
      memberCreator: {id: 'some id', username: 'bob'}
    }
  },
  answer1 = max.kommentarTillBot(data),
  person = max._sekreterare(new Date());
  
  data.action.data.text = '@maxblipblop läget?';
  var answer2 = max.kommentarTillBot(data);
  
  t.equal(answer1, '@bob ' + person + ' är sekreterare denna veckan.', '._sekreterare');
  t.equal(answer2, '@bob ' + 'Blip blop', 'blip blop');
  t.end();
});


/*
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

*/
