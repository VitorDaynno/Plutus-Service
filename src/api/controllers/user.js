var logger = require('../../config/logger')();
var UserBO = require('../../business/userBO');
var UserDAO = require('../../dao/userDAO');

module.exports = function() {
    var userDAO = new UserDAO();
    var business = new UserBO({userDAO: userDAO});

    return {
        auth: function(req, res){
            logger.info('Auth a user by email ', req.body.email);
            business.auth(req.body)
                .then(function(user){
                    res.send(user);
                });
        }
    };
};
