var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var dao = dependencies.userDAO;
    var jwt = dependencies.jwtHelper;

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
                            logger.info('[UserBO] Get user by email ' + body.email);
                            return dao.getAll({email: body.email, password: body.password});
                        })
                        .then(function(user){
                            if (user.name){
                                token = jwt.createToken(user);
                                console.log(token);
                                user.token = token;
                                resolve(user);
                            } else {
                                logger.error('[UserBO] Email or password are incorrect');
                                reject({code: 401, message: 'Email or password are incorrect'});
                            };
                        });
                };
            });
        }
    };
};
