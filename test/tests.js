process.env.KEY = 'dummy key';
process.env.TOKEN = 'dummy token';
process.env.USERID = '123456';
process.env.USERNAME = 'maxblipblop';

var test = require('tape'),
    max = require('../lib/bot.js'),
    reply,
    log,
    resetState = function(){
      reply = null;
      log = null;
    };

// swap handlers to intercept for testing
max
  .removeAllListeners('reply')
  .on('reply', function(cardId, answer, res){
    reply = answer;
  })
  .removeAllListeners('log')
  .on('log', function(msg){
    log = msg;
  });

var data = {
      action: {
        data: {
          text: 'text',
          card: {
            id: 'id'
          }
        },
        memberCreator: {
          id: 'id',
          username: 'username'
        }
      },
      model: {
        id: 'id'
      }
    },
    res = {end: function(){}};

test('replyToComment', function(t){

  data.action.memberCreator.id = process.env.USERID;
  max.emit('commentCard', data, res);
  t.ok(/Comment author is bot/.test(log), 'comment author is bot');
  t.ok(!reply);
  resetState();

  data.action.memberCreator.id = 'some other id';
  data.action.data.text = 'just a comment';
  max.emit('commentCard', data, res);
  t.ok(/Använd @username så får de en notis/.test(reply), 'no @ in comment');
  t.ok(!log);
  resetState();

  data.action.data.text = '@' + process.env.USERNAME + ' sekreterare idag?';
  max.emit('commentCard', data, res);
  t.ok(/C-F|Anna|Kicki/.test(reply), '@bot secretary duty');
  t.ok(!log);
  resetState();

  data.action.data.text = '@' + process.env.USERNAME + ' hi!';
  max.emit('commentCard', data, res);
  t.ok(/Blip blop/.test(reply), '@bot but no other match');
  t.ok(!log);
  resetState();

  data.action.data.text = '@foo zup?';
  max.emit('commentCard', data, res);
  t.ok(/Comment for another user/.test(log), '@user zup');
  t.ok(!reply);
  resetState();

  data.model.id = process.env.USERID;
  max.emit('commentCard', data, res);
  t.ok(/Model is bot/.test(log), 'Model is bot');
  t.ok(!reply);
  resetState();

  t.end();
});

test('longTitle', function(t){

  data.action.data.card.name = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  max.emit('createCard', data, res);
  t.ok(/Långa titlar är svåra att läsa/.test(reply), '>100 createCard');
  t.ok(!log);
  resetState();
  max.emit('updateCard', data, res);
  t.ok(/Långa titlar är svåra att läsa/.test(reply), '>100 createCard');
  t.ok(!log);
  resetState();

  data.action.data.card.name = "lorem";
  max.emit('createCard', data, res);
  t.ok(/Short title/.test(log), '<100 createCard');
  t.ok(!reply);
  resetState();
  max.emit('updateCard', data, res);
  t.ok(/Short title/.test(log), '<100 updateCard');
  t.ok(!reply);

  t.end();
});
