module.exports = function(req, res, next) {
  var data = JSON.parse(req.body);

  console.log('payload data', data); // data.action.type
  return next;
}
