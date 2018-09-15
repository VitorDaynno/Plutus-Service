var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var formPayment = dependencies.formPayment;
    var dao = dependencies.transactionDAO;

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
                        if (!transaction.category){
                            logger.error('[TransactionBO] An error occurred because Category not exist');
                            throw {code:422, message:'The entity should has a field category'};
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
                        return formPayment.getById(transaction.formPayment);
                    })
                    .then(function(formPayment){
                        logger.info('[TransactionBO] A formPayment are returned ' + JSON.stringify(formPayment));
                        if (!formPayment.id){
                            throw {code:404, message: 'The formPayment not found'};
                        }
                    })
                    .then(function(){
                        logger.info('[TransactionBO] A transaction will be inserted');
                        return dao.save(transaction);
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
        getAll: function(){
            return new Promise(function(resolve, reject){
                resolve();
            });
        }
    };
};
