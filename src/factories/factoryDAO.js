var UserDAO = require('../daos/userDAO');
var userModel = require('../models/user')();
var TransactionDAO = require('../daos/transactionDAO');
var transactionModel = require('../models/transaction')();
var AccountDAO  = require('../daos/accountDAO');
var accountModel = require('../models/account')();

module.exports = {
    getDAO: function(dao){
        switch (dao) {
            case 'account':
                return new AccountDAO({
                    account: accountModel
                });
            case 'transaction':
                return new TransactionDAO({
                    transaction: transactionModel
                });
            case 'user':
                return new UserDAO({
                    user: userModel
                });
        }
    }
};
