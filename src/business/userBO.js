var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var dao = dependencies.userDAO;

    return {
        dependencies:dependencies,
        auth: function(email, password){
            return new Promise(function(resolve, reject){
                logger.info('');
                dao.find(email, password)
                    .then(function(user){
                        resolve(user);
                    });
            });
        }
    };
};
