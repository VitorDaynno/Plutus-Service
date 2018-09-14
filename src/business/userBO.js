var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var dao = dependencies.userDAO;
    var jwt = dependencies.jwtHelper;
    var modelHelper = dependencies.modelHelper;
    var cryptoHelper = dependencies.cryptoHelper;

    return {
        dependencies:dependencies,

        auth: function(body){
            return new Promise(function(resolve, reject){
                if (!body.email || !body.password){
                    logger.error('[UserBO] An error occurred because email or password not exist');
                    reject({code:422, message:'Email and password are required'});
                } else {
                    var chain = Promise.resolve();
                    chain
                        .then(function(){
                            return cryptoHelper.encrypt(body.password);
                        })
                        .then(function(password){
                            logger.info('[UserBO] Get user by email ' + body.email);
                            return dao.getAll({email: body.email, password: password});
                        })
                        .then(function(user){
                            logger.info('[UserBO] The user are returned: ' + JSON.stringify(user));
                            if (user.length > 0){
                                return user[0];
                            } else {
                                logger.error('[UserBO] Email or password are incorrect');
                                throw {code: 401, message: 'Email or password are incorrect'};
                            };
                        })
                        .then(function(user){
                            return modelHelper.parseUser(user);
                        })
                        .then(function(user){
                            token = jwt.createToken(user);
                            user.token = token;
                            resolve(user);
                        })
                        .catch(function(error){
                            logger.error('[UserBO] An error occurred: ', error);
                            reject(error);
                        });
                };
            });
        }
    };
};
