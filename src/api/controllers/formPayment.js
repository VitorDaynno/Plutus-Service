var logger = require('../../config/logger')();
var BOFactory = require('../../factories/factoryBO');
var Helper = require('../../helpers/jwtHelper');
var helper = new Helper();

module.exports = function() {
    var business = BOFactory.getBO('formPayment');

    return {
        add: function(req, res){
            logger.info('[FormPayment-Controller] Adding a transaction ' + JSON.stringify(req.body));
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            var formPayment = req.body;
            formPayment.userId = tokenDecoded.id;
            business.add(formPayment)
                .then(function(formPayment){
                    res.status(201).send(formPayment);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        getAll: function(req, res) {
            logger.info('[FormPayment-Controller] Getting formsPayment');
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            var filter = {};
            filter.userId = tokenDecoded.id;
            business.getAll(filter)
                .then(function(formsPayment){
                    logger.info('[FormPayment-Controller] Returns formsPayment: ', formsPayment);
                    res.status(200).send(formsPayment);
                })
                .catch(function(error){
                    logger.error('[FormPayment-Controller] An error occurred: ' + JSON.stringify(error));
                    res.status(error.code).json(error.message);
                });
        },

        balances: function(req, res) {
            logger.info('[FormPayment-Controller] Getting balances');
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            var filter = {};
            filter.userId = tokenDecoded.id;
            business.balances(filter)
                .then(function(balances){
                    logger.info('[FormPayment-Controller] Returns balances: ' + JSON.stringify(balances));
                    res.status(200).send(balances);
                })
                .catch(function(error){
                    logger.error('[FormPayment-Controller] An error occurred: ' + JSON.stringify(error));
                    res.status(error.code).json(error.message);
                });
        }
    };
};
