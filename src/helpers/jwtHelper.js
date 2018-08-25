var jwt           = require('jsonwebtoken');
var settings      = require('../config/settings');

module.exports = function() {
  return {
    secret: settings.jwt.secret,
    expiresIn: settings.jwt.expiresIn,
    createToken: function(user) {
        return jwt.sign(user, settings.jwt.secret, {expiresIn: settings.jwt.expiresIn});
        }
    };
};
