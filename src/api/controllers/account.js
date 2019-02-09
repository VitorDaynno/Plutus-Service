var logger = require('../../config/logger')();
var BOFactory = require('../../factories/factoryBO');
var Helper = require('../../helpers/jwtHelper');
var helper = new Helper();

module.exports = function() {
    var business = BOFactory.getBO('account');

    return {
        add: function(req, res){
            logger.info('[Account-Controller] Adding a transaction ' + JSON.stringify(req.body));
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            var account = req.body;
            account.userId = tokenDecoded.id;
            business.add(account)
                .then(function(account){
                    res.status(201).send(account);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        getAll: function(req, res) {
            logger.info('[Account-Controller] Getting accounts');
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            var filter = {};
            filter.userId = tokenDecoded.id;
            business.getAll(filter)
                .then(function(accounts){
                    logger.info('[Account-Controller] Returns accounts: ', accounts);
                    res.status(200).send(accounts);
                })
                .catch(function(error){
                    logger.error('[Account-Controller] An error occurred: ' + JSON.stringify(error));
                    res.status(error.code).json(error.message);
                });
        },

        balances: function(req, res) {
            logger.info('[Account-Controller] Getting balances');
            var token = req.headers.authorization.split(' ')[1];
            tokenDecoded = helper.decodedToken(token);
            var filter = {};
            filter.userId = tokenDecoded.id;
            business.balances(filter)
                .then(function(balances){
                    logger.info('[Account-Controller] Returns balances: ' + JSON.stringify(balances));
                    res.status(200).send(balances);
                })
                .catch(function(error){
                    logger.error('[Account-Controller] An error occurred: ' + JSON.stringify(error));
                    res.status(error.code).json(error.message);
                });
        }
    };
};
