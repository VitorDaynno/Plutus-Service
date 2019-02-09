var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var account = dependencies.account;

    return {
        dependencies: dependencies,

        save: function(entity) {
                return new Promise(function(resolve, reject){
                    logger.info('[AccountDAO] Saving a account in database: ' + JSON.stringify(entity));
                    account.create(entity)
                        .then(function(account){
                            logger.info('[AcountDAO] The account saved in database with id: ' + account._id);
                            resolve(account);
                        })
                        .catch(function(error){
                            logger.error('[AccountDAO] An error occurred: ', error);
                            if (error.name === 'CastError' || error.name === 'ValidatorError'){
                                reject({code: 422, message: error.message});
                            } else {
                                reject({code: 500, message: error.message});
                            };
                        });
                });
        },

        getById: function(id) {
            return new Promise(function(resolve, reject){
                logger.info('[AccountDAO] Finding a account by id ' + id);
                account.findById(id)
                    .exec()
                    .then(function(account) {
                        logger.info('[AccountDAO] A account returned: ' + JSON.stringify(account));
                        resolve(account);
                    })
                .catch(function(error){
                    logger.error('[AccountDAO] An error occurred: ' + error);
                    if (error.name === 'CastError' || error.name === 'ValidatorError'){
                        reject({code: 422, message: error.message});
                    } else {
                        reject({code: 500, message: error.message});
                    };
                });
            });
        },

        getAll: function(filter){
            return new Promise(function(resolve){
                logger.info('[AccountDAO] Finding a account by filter ', filter);
                account.find(filter)
                .exec()
                .then(function(accounts) {
                    logger.info('[AccountDAO] A account returned: ' + JSON.stringify(accounts));
                    resolve(accounts);
                });
            });
        }
    };
};
