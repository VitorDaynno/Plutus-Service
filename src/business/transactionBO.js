var logger = require('../config/logger')();
var _ = require('lodash');

module.exports = function(dependencies) {
    var dao = dependencies.transactionDAO;
    var formPaymentBO = dependencies.formPaymentBO;
    var userBO = dependencies.userBO;
    var modelHelper = dependencies.modelHelper;
    var dateHelper = dependencies.dateHelper;

    return {
        dependencies:dependencies,

        add: function(transaction){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!transaction.description){
                            logger.error('[TransactionBO] An error occurred because Description not exist');
                            throw {code:422, message:'The entity should has a field description'};
                        }
                        if (!transaction.value){
                            logger.error('[TransactionBO] An error occurred because Value not exist');
                            throw {code:422, message:'The entity should has a field value'};
                        }
                        if (!transaction.categories){
                            logger.error('[TransactionBO] An error occurred because Categories not exist');
                            throw {code:422, message:'The entity should has a field categories'};
                        }
                        if (!transaction.purchaseDate){
                            logger.error('[TransactionBO] An error occurred because PurchaseDate not exist');
                            throw {code:422, message:'The entity should has a field purchaseDate'};
                        }
                        if (!transaction.formPayment){
                            logger.error('[TransactionBO] An error occurred because FormPayment not exist');
                            throw {code:422, message:'The entity should has a field formPayment'};
                        }
                    })
                    .then(function(){
                        logger.info('[TransactionBO] Getting formPayment by id ' + transaction.formPayment);
                        return formPaymentBO.getById({id: transaction.formPayment});
                    })
                    .then(function(formPayment){
                        logger.info('[TransactionBO] A formPayment are returned ' + JSON.stringify(formPayment));
                        if (!formPayment.id){
                            throw {code:404, message: 'The formPayment not found'};
                        }
                    })
                    .then(function(){
                        logger.info('[TransactionBO] A transaction will be inserted');
                        transaction.isEnabled = true;
                        transaction.creationDate = dateHelper.now();
                        return dao.save(transaction);
                    })
                    .then(function(transaction){
                        logger.info('[TransactionBO] A transaction was inserted: ', transaction);
                        var p = [];
                        if (transaction && transaction.installments){
                            for (var i = 0; i < transaction.installments; i++) {
                                var installmentsTransaction = _.cloneDeep(transaction)._doc;
                                delete installmentsTransaction.installments;
                                delete installmentsTransaction._id;
                                var originalDate = transaction.purchaseDate;
                                installmentsTransaction.purchaseDate = new Date(originalDate.getFullYear(), originalDate.getMonth() + i, originalDate.getDate());
                                logger.info('[TransactionBO] A installment transaction will be inserted: ', installmentsTransaction);
                                p.push(dao.save(installmentsTransaction));
                            }
                        }
                        return transaction;
                    })
                    .then(function(transaction){
                        return modelHelper.parseTransaction(transaction);
                    })
                    .then(function(transaction){
                        resolve(transaction);
                    })
                    .catch(function(error){
                        logger.error('[TransactionBO] An error occurred ', error);
                        reject(error);
                    });
            });
        },
        getAll: function(body){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!body || !body.userId){
                            logger.error('[TransactionBO] An error occurred because UserId not exist');
                            throw {code: 422, message: 'UserId is required'};
                        }
                    })
                    .then(function(){
                        logger.info('[TransactionBO] Getting user by id: ' + body.userId);
                        return userBO.getById({id: body.userId});
                    })
                    .then(function(user){
                        if (!user || !user.id) {
                            logger.info('[TransactionBO] User not found by id: ' + body.userId);
                            resolve([]);
                        } else {
                            logger.info('[TransactionBO] Getting transactions by userId: ' + body.userId);
                            filter = {userId: body.userId};
                            return dao.getAll(filter);
                        }
                    })
                    .then(function(transactions){
                        logger.info('[TransactionBO] The transactions returned: ' + JSON.stringify(transactions));
                        resolve(transactions);
                    })
                    .catch(function(error){
                        logger.error('[TransactionBO] An error occurred: ', error);
                        reject(error);
                    });
            });
        }
    };
};
