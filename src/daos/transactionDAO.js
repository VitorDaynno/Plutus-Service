const logger = require('../config/logger')();

module.exports = function(dependencies) {
    const transactionModel = dependencies.transaction;

    return {
        dependencies: dependencies,

        save: function(object) {
            return new Promise(function(resolve, reject){
                logger.info('[TransactionDAO] Saving transaction in database: ' + JSON.stringify(object));
                transactionModel.create(object)
                    .then(function(transaction){
                        logger.info('[TransactionDAO] The transaction saved in database with id: ' + transaction._id);
                        resolve(transaction);
                    })
                    .catch(function(error){
                        logger.error('[TransactionDAO] An error occurred: ', error);
                        if (error.name === 'CastError' || error.name === 'ValidatorError'){
                            reject({code: 422, message: error.message});
                        } else {
                            reject({code: 500, message: error.message});
                        }
                    });
            });
        },

        getAll: function(filter) {
            return new Promise(function(resolve){
                logger.info('[TransactionDAO] Finding transaction by filter ' + JSON.stringify(filter));
                transactionModel.find(filter)
                .populate('account')
                .exec()
                .then(function(transactions) {
                    logger.info('[TransactionsDAO] A transactions returned: ' + JSON.stringify(transactions));
                    resolve(transactions);
                });
            });
        },

        balances: function(filter) {
            return new Promise(function(resolve){
                logger.info('[TransactionDAO] Getting balances in database by filter ', filter);
                transactionModel.aggregate([{$match: filter},
                        {$group:{_id: '$account', balance: {$sum: '$value'}}},
                        {$lookup:{from: 'accounts', localField: '_id', foreignField: '_id', as: 'account'}}
                    ])
                    .then(function(balances){
                        logger.info('[TransactionDAO] The balances returns by database: ', balances);
                        resolve(balances);
                    });
            });
        },

        delete: function(id, transaction) {
            return new Promise(function(resolve, reject){
                logger.info('[TransactionDAO] Deleting transaction by id ' + id);
                if (!id || id === ''){
                    logger.error('[TransactionDAO] Id is empty');
                    reject();
                }
                transactionModel.update({_id: id}, transaction)
                    .then(function(transaction){
                        logger.info('[TransactionDAO] Transaction deleted by id ' + id);
                        resolve(transaction);
                    })
                    .catch(function(error){
                        logger.error('[TransactionDAO] An error occurred: ', error);
                        if (error.name === 'CastError' || error.name === 'ValidatorError'){
                            reject({code: 422, message: error.message});
                        } else {
                            reject({code: 500, message: error.message});
                        }
                    });
            });
        }
    };
};
