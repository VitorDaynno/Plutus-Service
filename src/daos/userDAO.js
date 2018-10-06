var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var user = dependencies.user;

    return {
        dependencies: dependencies,

        getAll: function(filter){
            return new Promise(function(resolve, reject){
                logger.info('[UserDAO] Finding user by filter ' + JSON.stringify(filter));
                user.find(filter)
                    .exec()
                    .then(function(user) {
                        logger.info('[UserDAO] A user returned: ' + JSON.stringify(user));
                        resolve(user);
                    });
            });
        },

        getById: function(userId){

        }
    };
};
