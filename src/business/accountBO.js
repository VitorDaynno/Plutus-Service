var logger = require('../config/logger')();
var mongoose = require('mongoose');

module.exports = function(dependencies) {
    var dao = dependencies.accountDAO;
    var transactionDAO = dependencies.transactionDAO;
    var modelHelper = dependencies.modelHelper;
    var dateHelper = dependencies.dateHelper;

    return {
        dependencies:dependencies,

        add: function(account){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!account){
                            logger.error('[AccountBO] An error occurred because object not exist');
                            throw {code:422, message:'The entity can not be empty'};
                        }
                        if (!account.name){
                            logger.error('[AccountBO] An error occurred because Name not exist');
                            throw {code:422, message:'The entity should has a field name'};
                        }
                        if (!account.type){
                            logger.error('[AccountBO] An error occurred because Type not exist');
                            throw {code:422, message:'The entity should has a field type'};
                        }
                    })
                    .then(function(){
                        logger.info('[AccountBO] A account will be inserted');
                        account.isEnabled = true;
                        account.creationDate = dateHelper.now();
                        return dao.save(account);
                    })
                    .then(function(account){
                        logger.info('[AccountBO] A account was inserted: ' + JSON.stringify(account));
                        return modelHelper.parseAccount(account);
                    })
                    .then(function(account){
                        logger.info('[AccountBO] A account parsed was return: ' + JSON.stringify(account));
                        resolve(account);
                    })
                    .catch(function(error){
                        logger.error('[AccountBO] An error occurred ', error);
                        reject(error);
                    });
            });
        },

        getById: function(body) {
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!body || !body.id){
                            logger.error('[AccountBO] An error occurred because body or field id not exist');
                            throw {code: 422, message: 'Id are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[AccountBO] Getting account by id: '+ body.id);
                        return dao.getById(body.id);
                    })
                    .then(function(account){
                        if (!account || !account._id){
                            logger.info('[AccountBO] Account not found by id: ' + body.id);
                            return {};
                        } else {
                            return modelHelper.parseAccount(account);
                        }
                    })
                    .then(function(account){
                        logger.info('[AccountBO] A account was returned: ' + JSON.stringify(account));
                        resolve(account);
                    })
                    .catch(function(error){
                        logger.error('[AccountBO] An error occurred: ', error);
                        reject(error);
                    });
            });
        },

        getAll: function(body) {
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!body || !body.userId){
                            logger.error('[AccountBO] An error occurred because body or field userId not exist');
                            throw {code: 422, message: 'UserId are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[AccountBO] Init the mount filter');
                        var filter = {};
                        filter.userId = body.userId;

                        return filter;
                    })
                    .then(function(filter){
                        logger.info('[AccountBO] Getting accounts in database by filter: ', filter);
                        return dao.getAll(filter);
                    })
                    .then(function(accounts){
                        logger.info('[AccountBO] The accounts was returned: ', accounts);
                        return modelHelper.parseAccount(accounts);
                    })
                    .then(function(accounts){
                        logger.info('[AccountBO] The accounts was parsed: ', JSON.stringify(accounts));
                        resolve(accounts);
                    })
                    .catch(function(error){
                        logger.error('[AccountBO] An error occurred: ', error);
                        reject(error);
                    });
            });
        },

        balances: function(body) {
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!body || !body.userId){
                            logger.error('[AccountBO] An error occurred because userId not exist');
                            throw {code: 422, message: 'UserId are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[AccountBO] Mouting filters by body', body);
                        filter = {};
                        filter.userId = mongoose.Types.ObjectId(body.userId);
                        if (body.initialDate){
                            filter.initialDate = body.initialDate;
                        }
                        if (body.finalDate){
                            filter.finalDate = body.finalDate;
                        }
                        return filter;
                    })
                    .then(function(filter){
                        logger.info('[AccountBO] Getting balances by filter', filter);
                        return transactionDAO.balances(filter);
                    })
                    .then(function(balances){
                        logger.info('[AccountBO] Balances are returned', balances);
                        return modelHelper.parseBalance(balances);
                    })
                    .then(function(balances){
                        logger.info('[AccountBO] Balances parseds', balances);
                        resolve(balances);
                    })
                    .catch(function(error){
                        logger.error('[AccountBO] An error occurred'+ error);
                        reject(error);
                    });
            });
        }
    };
};
