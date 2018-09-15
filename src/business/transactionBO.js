var logger = require('../config/logger')();

module.exports = function(){
    return {
        add: function(body){
            return new Promise(function(resolve, reject){
                if (!body.description){
                    logger.error('[TransactionBO] An error occurred because Description not exist');
                    reject({code:422, message:'The entity should has a field description'});
                }
                if (!body.value){
                    logger.error('[TransactionBO] An error occurred because Value not exist');
                    reject({code:422, message:'The entity should has a field value'});
                }
                if (!body.category){
                    logger.error('[TransactionBO] An error occurred because Category not exist');
                    reject({code:422, message:'The entity should has a field category'});
                }
                if (!body.purchaseDate){
                    logger.error('[TransactionBO] An error occurred because PurchaseDate not exist');
                    reject({code:422, message:'The entity should has a field purchaseDate'});
                }
            });
        },
        getAll: function(){
            return new Promise(function(resolve, reject){
                resolve();
            });
        }
    };
};
