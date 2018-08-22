var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var dao = dependencies.userDAO;

    return {
        dependencies:dependencies,

        auth: function(body){
            return new Promise(function(resolve, reject){
                if (!body.email || !body.password){
                    logger.error('[UserBO] An error occurred because email or password not exist');
                    reject({code:422, message:'Email and password are required'});
                }

                var chain = Promise.resolve();
                chain
                    .then(function(){
                        logger.info('[UserBO] Get user by email ', body.email);
                        return dao.getAll({email: body.email, password: body.password});
                    })
                    .then(function(user){
                        resolve();
                    });
            });
        }
    };
};
