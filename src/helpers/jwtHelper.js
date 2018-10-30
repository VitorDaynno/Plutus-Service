var jwt           = require('jsonwebtoken');
var settings      = require('../config/settings');
var logger        = require('../config/logger')();

module.exports = function() {
  return {
        //secret: settings.jwt.secret,
        //expiresIn: settings.jwt.expiresIn,

        createToken: function(user) {
            return jwt.sign(user, settings.jwt.secret, {expiresIn: settings.jwt.expiresIn});
        },

        verifyToken: function(req, res) {
            var chain = Promise.resolve();

            chain
                .then(function(){
                    var token = req.headers.authorization;
                    logger.info('[jwtHelper] Validating authentication by token: '+ token);
                    if (!token || token === ''){
                        logger.error('[jwtHelper] The token does not exist or is empty');
                        throw {code: 403, message: 'The token does not exist or is empty'};
                    }
                })
                .then(function(token){
                    jwt.verify(token, settings.jwt.secret, function(error, decoded){
                        if (error){

                        }
                    });
                })
                .catch(function(error){
                    logger.error('[jwtHelper] An error occurred: ', error);
                    if (error.code || error.code === 403){
                        res.status(403).json({});
                    }
                });
        }
    };
};
