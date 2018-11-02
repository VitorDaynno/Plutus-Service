var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var dao = dependencies.formPaymentDAO;
    var modelHelper = dependencies.modelHelper;

    return {
        dependencies:dependencies,

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
                            logger.info('[FormPaymentBO] Form of payment not found by id: ' + JSON.stringify(formPayment));
                            resolve({});
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
        }
    };
};
