var max = require('./bot.js');

module.exports = function(req, res, next){
  req.max = max;
  return next();
}