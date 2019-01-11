var logger = require('../config/logger')();
var mongoose = require('mongoose');

module.exports = function(dependencies) {
    var dao = dependencies.formPaymentDAO;
    var transactionDAO = dependencies.transactionDAO;
    var modelHelper = dependencies.modelHelper;
    var dateHelper = dependencies.dateHelper;

    return {
        dependencies:dependencies,

        add: function(formPayment){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!formPayment){
                            logger.error('[FormPaymentBO] An error occurred because object not exist');
                            throw {code:422, message:'The entity can not be empty'};
                        }
                        if (!formPayment.name){
                            logger.error('[FormPaymentBO] An error occurred because Name not exist');
                            throw {code:422, message:'The entity should has a field name'};
                        }
                        if (!formPayment.type){
                            logger.error('[FormPaymentBO] An error occurred because Type not exist');
                            throw {code:422, message:'The entity should has a field type'};
                        }
                    })
                    .then(function(){
                        logger.info('[FormPaymentBO] A form a payment will be inserted');
                        formPayment.isEnabled = true;
                        formPayment.creationDate = dateHelper.now();
                        return dao.save(formPayment);
                    })
                    .then(function(formPayment){
                        logger.info('[FormPaymentBO] A form a payment was inserted: ' + JSON.stringify(formPayment));
                        return modelHelper.parseFormPayment(formPayment);
                    })
                    .then(function(formPayment){
                        logger.info('[FormPaymentBO] A form a payment parsed was return: ' + JSON.stringify(formPayment));
                        resolve(formPayment);
                    })
                    .catch(function(error){
                        logger.error('[FormPaymentBO] An error occurred ', error);
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
                            logger.error('[FormPaymentBO] An error occurred because body or field id not exist');
                            throw {code: 422, message: 'Id are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[FormPaymentBO] Getting form of payment by id: '+ body.id);
                        return dao.getById(body.id);
                    })
                    .then(function(formPayment){
                        if (!formPayment || !formPayment._id){
                            logger.info('[FormPaymentBO] Form of payment not found by id: ' + body.id);
                            return {};
                        } else {
                            return modelHelper.parseFormPayment(formPayment);
                        }
                    })
                    .then(function(formPayment){
                        logger.info('[FormPaymentBO] A form of payment was returned: ' + JSON.stringify(formPayment));
                        resolve(formPayment);
                    })
                    .catch(function(error){
                        logger.error('[FormPaymentBO] An error occurred: ', error);
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
                            logger.error('[FormPaymentBO] An error occurred because body or field userId not exist');
                            throw {code: 422, message: 'UserId are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[FormPaymentBO] Init the mount filter');
                        var filter = {};
                        filter.userId = body.userId;

                        return filter;
                    })
                    .then(function(filter){
                        logger.info('[FormPaymentBO] Getting formsPayments in database by filter: ', filter);
                        return dao.getAll(filter);
                    })
                    .then(function(formsPayment){
                        logger.info('[FormPaymentBO] The formsPayments was returned: ', formsPayment);
                        return modelHelper.parseFormPayment(formsPayment);
                    })
                    .then(function(formsPayment){
                        logger.info('[FormPaymentBO] The formsPayments was parsed: ', JSON.stringify(formsPayment));
                        resolve(formsPayment);
                    })
                    .catch(function(error){
                        logger.error('[FormPaymentBO] An error occurred: ', error);
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
                            logger.error('[FormPaymentBO] An error occurred because userId not exist');
                            throw {code: 422, message: 'UserId are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[FormPaymentBO] Mouting filters by body', body);
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
                        logger.info('[FormPaymentBO] Getting balances by filter', filter);
                        return transactionDAO.balances(filter);
                    })
                    .then(function(balances){
                        logger.info('[FormPaymentBO] Balances are returned', balances);
                        return modelHelper.parseBalance(balances);
                    })
                    .then(function(balances){
                        logger.info('[FormPaymentBO] Balances parseds', balances);
                        resolve(balances);
                    })
                    .catch(function(error){
                        logger.error('[FormPaymentBO] An error occurred'+ error);
                        reject(error);
                    });
            });
        }
    };
};
