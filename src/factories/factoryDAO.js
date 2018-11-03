var UserDAO = require('../daos/userDAO');
var userModel = require('../models/user')();
var TransactionDAO = require('../daos/transactionDAO');
var transactionModel = require('../models/transaction');
var FormPaymentDAO  = require('../daos/formPaymentDAO');
var formPaymentModel = require('../models/formPayment')();

module.exports = {
    getDAO: function(dao){
        switch (dao) {
            case 'formPayment':
                return new FormPaymentDAO({
                    formPayment: formPaymentModel
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
