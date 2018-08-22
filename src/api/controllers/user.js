var logger = require('../../config/logger')();
var BOFactory = require('../../factories/factoryBO');

module.exports = function() {
    var business = BOFactory.getBO('user');

    return {
        auth: function(req, res){
            logger.info('Auth a user by email ', req.body.email);
            business.auth(req.body)
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        }
    };
};
