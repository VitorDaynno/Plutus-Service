var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var transaction = dependencies.transaction;

    return {
        dependencies: dependencies,

        save: function(object) {
            return new Promise(function(resolve, reject){
                logger.info('[TransactionDAO] Saving transaction in database: ' + JSON.stringify(object));
                transaction.create(object)
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
                        };
                    });
            });
        },

        getAll: function(filter) {
            return new Promise(function(resolve, reject){
                logger.info('[TransactionDAO] Finding transaction by filter ' + JSON.stringify(filter));
                transaction.find(filter)
                .exec()
                .then(function(transactions) {
                    logger.info('[TransactionsDAO] A transactions returned: ' + JSON.stringify(transactions));
                    resolve(transactions);
                });
            });
        }
    };
};
