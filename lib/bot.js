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

bot._sekreterare = function(d) {
  function getWeekNumber() {
    var d = new Date(+this);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
  }
  
  var peeps = ['Anna','Kicki','C-F'],
      weekNumber = getWeekNumber.call(d),
      index = weekNumber % peeps.length,
      person = peeps[index];
  
  return person;  
}

bot.kommentarTillBot = function(data) {
  var comment = data.action.data.text,
      authorId = data.action.memberCreator.id,
      authorUsername = data.action.memberCreator.username,
      cardID = data.action.data.card.id,
      answer = "@" + authorUsername + " ";

  // debug
  console.log('comment', comment);
  
  if (this.botInComment(comment) && this.authorIsNotBot(authorId)) {
    
    if (/sekreterare/.test(comment)) {
      
      // debug
      console.log('/sekreterare/ passed');
      
      answer += this._sekreterare(new Date()) + " är sekreterare denna veckan."
      
    } else {
      answer += "Blip blop";
    }
    
    // debug
    console.log(answer);

    return this.postComment(cardID, answer);
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
