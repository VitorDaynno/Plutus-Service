const logger = require('../../config/logger')();
const BOFactory = require('../../factories/factoryBO');
const Helper = require('../../helpers/jwtHelper');
const helper = new Helper();

module.exports = function() {
    const business = BOFactory.getBO('transaction');

    return {
        add: function(req, res){
            logger.info('[Transactions-Controller] Adding a transaction ' + JSON.stringify(req.body));
            const token = req.headers.authorization.split(' ')[1];
            const tokenDecoded = helper.decodedToken(token);
            const transaction = req.body;
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
            const token = req.headers.authorization.split(' ')[1];
            const tokenDecoded = helper.decodedToken(token);
            const onlyCredit = req.query.onlyCredit ? req.query.onlyCredit : null;
            business.getAll({userId: tokenDecoded.id, onlyCredit: onlyCredit})
                .then(function(transactions){
                    res.status(200).send(transactions);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        delete: function(req, res){
            const id = req.params.id ? req.params.id : null;
            logger.info('[Transactions-Controller] Deleting transaction by id ' + id);
            business.delete({id: id})
                .then(function(transaction){
                    res.send(transaction);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        }
    };
};
