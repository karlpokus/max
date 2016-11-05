module.exports = function(req, res, next) {
  if (req.max.originIsTrello(req)) {
    return next();
  } else {
    return next('origin is not Trello');
  }
}