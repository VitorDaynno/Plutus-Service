var logger = require('../../config/logger')();
var BOFactory = require('../../factories/factoryBO');

module.exports = function() {
    var business = BOFactory.getBO('user');

    return {
        auth: function(req, res){
            logger.info('[User-Controller] Auth a user by email ' + req.body.email);
            business.auth(req.body)
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        getById: function(req, res){
            logger.info('[User-Controller] Getting user by id ' + req.params.id);
            var id = req.params.id ? req.params.id : null;
            business.getById({id: id})
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        }
    };
};
