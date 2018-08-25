var logger = require('../config/logger');

module.exports = function(dependencies) {
    var user = dependencies.user;

    return {
        dependencies: dependencies,

        getAll: function(filter){
            return new Promise(function(resolve, reject){
                user.find(filter)
                    .exec()
                    .then(function(user) {
                        resolve(user);
                    });
            });
        }
    };
};
