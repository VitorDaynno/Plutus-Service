var UserDAO = require('../daos/userDAO');
var userModel = require('../models/user')();
var TransactionDAO = require('../daos/transactionDAO');
var transactionModel = require('../models/transaction');

module.exports = {
    getDAO: function(dao){
        switch (dao) {
            case 'user':
                return new UserDAO({
                    user: userModel
                });
            case 'transaction':
                return new TransactionDAO({
                    transaction: transactionModel
                });
        }
    }
};
