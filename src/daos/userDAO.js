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

        getById: function(id){
            return new Promise(function(resolve, reject){
                logger.info('[UserDAO] Finding user by id ' + JSON.stringify(id));
                user.findById(id)
                    .exec()
                    .then(function(user) {
                        logger.info('[UserDAO] A user returned: ' + JSON.stringify(user));
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserDAO] An error occurred: ' + error);
                        if (error.name === 'CastError' || error.name === 'ValidatorError'){
                            reject({code: 422, message: error.message});
                        } else {
                            reject({code: 500, message: error.message});
                        };
                    });
            });
        }
    };
};
