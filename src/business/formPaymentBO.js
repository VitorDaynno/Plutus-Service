var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var dao = dependencies.formPaymentDAO;
    var modelHelper = dependencies.modelHelper;

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
        }
    };
};
