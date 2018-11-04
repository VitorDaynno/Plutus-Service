var logger = require('../../config/logger')();
var BOFactory = require('../../factories/factoryBO');

module.exports = function() {
    var business = BOFactory.getBO('formPayment');

    return {
        add: function(req, res){
            logger.info('[FormPayment-Controller] Adding a transaction ' + JSON.stringify(req.body));
            business.add(req.body)
                .then(function(transaction){
                    res.status(201).send(transaction);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        }
    };
};
