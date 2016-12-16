var Trobot = require('trobot'),
    max = new Trobot();

// HELPERS

function getPersonFromWeek() {
  function getWeekNumber() {
    var d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
  }
  
  var peeps = ['Anna','Kicki','C-F'],
      weekNumber = getWeekNumber(),
      index = weekNumber % peeps.length,
      person = peeps[index];
  
  return person;  
}

function readComment(comment, authorUsername, bot) {
  var answer = "@" + authorUsername + " ",
      botUsername = "@" + bot.data.username;
  
  if (!/@/g.test(comment)) {
    answer += "Använd @username så får de en notis om din kommentar via mejl.";
    return answer;
  }
  if (/sekreterare/i.test(comment)) {
    answer += getPersonFromWeek() + " är sekreterare denna veckan."
    return answer;
  }
  if (new RegExp(botUsername).test(comment)) {
    answer += "Blip blop";
    return answer;
  }
}

// EVENT HANDLERS

function replyToComment(data, res) {
  var comment = data.action.data.text,
      authorId = data.action.memberCreator.id,
      authorUsername = data.action.memberCreator.username,
      cardId = data.action.data.card.id;
  
  if (authorId !== this.data.userId) {
    var answer = readComment(comment, authorUsername, this);
    this.emit('reply', cardId, answer, res);
    
  } else {
    this.emit('log', 'comment author is bot');
    res.statusCode = 200;
    res.end();
  }
}

function longTitle(data, res) {
  var titleLength = data.action.data.card.name.length,
      authorUsername = data.action.memberCreator.username,
      cardId = data.action.data.card.id;

  if (titleLength > 100) {
    var answer = "@" + authorUsername + " Långa titlar är svåra att läsa :( Kanske stoppa en del i beskrivningen ist?";
    this.emit('reply', cardId, answer, res);
    
  } else {
    this.emit('log', 'title is less than ' + titleLength);
    res.statusCode = 200;
    res.end();
  }
}

function addWebhook(data, res) {
  
  this.emit('log', data);
  res.end();
  
  /*
  var self = this,
      url = "/1/webhooks",
      payload = {
        description: 'webhook for random board',
        callbackURL: self.data.webhookCallbackURLdefault,
        idModel: data.action.idMemberCreator,
        key: self.trello.key,
        token: self.trello.token
      };

  self.trello.post(url, payload, function(err, postData){
    if (err) {
      self.emit('error', err, 500, res);
      return
    }
    self.emit('log', 'webhook added');
  });
  */
}

function removeWebhook(data, res) {
  
  this.emit('log', data);
  res.end();
  
  /*
  var self = this,
      url = "/1/webhooks/" + data.action.idMemberCreator,
      payload = {
        key: self.trello.key,
        token: self.trello.token
      };

  self.trello.del(url, payload, function(err, delData){
    if (err) {
      self.emit('error', err, 500, res);
      return
    }
    self.emit('log', 'webhook removed');
  });
  */
  
}

// EVENTS

max.on('log', console.log);
max.on('commentCard', replyToComment);
max.on('createCard', longTitle);
max.on('updateCard', longTitle);
max.on('addMemberToBoard', addWebhook);
max.on('removeMemberToBoard', removeWebhook);

module.exports = max;