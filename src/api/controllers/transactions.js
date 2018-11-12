var logger = require('../../config/logger')();
var BOFactory = require('../../factories/factoryBO');
var Helper = require('../../helpers/jwtHelper');
var helper = new Helper();

module.exports = function() {
    var business = BOFactory.getBO('transaction');

    return {
        add: function(req, res){
            logger.info('[Transactions-Controller] Adding a transaction ' + JSON.stringify(req.body));
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            var transaction = req.body;
            transaction.userId = tokenDecoded.id;
            business.add(transaction)
                .then(function(transaction){
                    res.status(201).send(transaction);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        getAll: function(req, res){
            logger.info('[Transactions-Controller] Getting transactions');
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            business.getAll({userId: tokenDecoded.id})
                .then(function(transactions){
                    res.status(200).send(transactions);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        }
    };
};
