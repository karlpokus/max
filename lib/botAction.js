module.exports = function(req, res, next) {  
  var data = JSON.parse(req.body),
      max = req.max;
  
  if (max.actionTypesAreOneOf(['commentCard'], data)) {
    max.kommentarTillBot(data);
    max.ingetAnvändarnamn(data);
  }
  if (max.actionTypesAreOneOf(['createCard', 'updateCard'], data)) {
    max.långTitel(data);
  }
  return next();
}