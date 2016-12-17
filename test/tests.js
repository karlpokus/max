process.env.KEY = 'dummy key';
process.env.TOKEN = 'dummy token';
process.env.USERID = '123456';
process.env.USERNAME = 'maxblipblop';

var test = require('tape'),
    max = require('../lib/bot.js'),
    replies = [],
    logs = [];

// swap handlers to intercept for testing
max
  .removeAllListeners('reply')
  .on('reply', function(cardId, answer, res){
    replies.push(answer);
  })
  .removeAllListeners('log')
  .on('log', function(msg){
    logs.push(msg);
  });

var data = {
      action: {
        data: {
          text: 'comment goes here',
          card: {
            id: 'id'
          }
        },
        memberCreator: {
          id: process.env.USERID,
          username: 'username'
        }
      }
    },
    res = {end: function(){}};

test('replyToComment', function(t){

  var expectedReply = 'comment author is bot';
  max.emit('commentCard', data, res);
  t.equal(logs[0], expectedReply, 'comment author is bot');

  data.action.memberCreator.id = 'some other id';
  max.emit('commentCard', data, res);
  t.ok(/Använd @username så får de en notis/.test(replies[0]), 'no@inComment');

  data.action.data.text = '@' + process.env.USERNAME + ' sekreterare idag?';
  max.emit('commentCard', data, res);
  t.ok(/C-F|Anna|Kicki/.test(replies[1]), 'secretary duty');

  data.action.data.text = '@' + process.env.USERNAME + ' hi!';
  max.emit('commentCard', data, res);
  t.ok(/Blip blop/.test(replies[2]), '@bot but no other match');

  t.end();
});

test('longTitle', function(t){

  data.action.data.card.name = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  max.emit('createCard', data, res);
  max.emit('updateCard', data, res);
  t.ok(/Långa titlar är svåra att läsa/.test(replies[3]), '>100 createCard');
  t.ok(/Långa titlar är svåra att läsa/.test(replies[4]), '>100 updateCard');

  data.action.data.card.name = "lorem";
  max.emit('createCard', data, res);
  max.emit('updateCard', data, res);
  t.ok(/title is less than/.test(logs[1]), '<100 createCard');
  t.ok(/title is less than/.test(logs[2]), '<100 updateCard');

  t.end();
});
