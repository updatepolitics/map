var path = require('path');

module.exports = function() {
  return function setRoutes(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../client/index.html'));
  }
}
