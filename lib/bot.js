var Trobot = require('trobot'),
    bot = new Trobot();

/* Custom functions på svenska */

bot.ingetAnvändarnamn = function(data) {
  var comment = data.action.data.text,
      authorId = data.action.memberCreator.id,
      authorUsername = data.action.memberCreator.username,
      cardId = data.action.data.card.id,
  		answer;
  // check
  if (this.commentHasNoProboscis(comment) && this.authorIsNotBot(authorId)) {
    answer = "@" + authorUsername + " Använd @username så får de en notis om din kommentar via mejl.";
    // POST
    this.postComment(cardId, answer);
  }
};

bot.kommentarTillBot = function(data) {
  var comment = data.action.data.text,
      authorId = data.action.memberCreator.id,
      authorUsername = data.action.memberCreator.username,
      cardID = data.action.data.card.id,
      answer;
  // check
  if (this.botInComment(comment) && this.authorIsNotBot(authorId)) {
    answer = "@" + authorUsername + " Blip blop. Jag är en bot och förstår inte svenska :)";
    // POST
    this.postComment(cardID, answer);
  }
};

bot.långTitel = function(data) {
  var title = data.action.data.card.name.length,
      authorUsername = data.action.memberCreator.username,
      cardID = data.action.data.card.id,
      answer;
  // check
  if (title > 100) {
    answer = "@" + authorUsername + " Långa titlar är svåra att läsa :( Kanske stoppa en del i beskrivningen ist?";
    // POST
    this.postComment(cardID, answer);
  }
};

// export
module.exports = bot;
