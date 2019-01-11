var DAOFactory = require('./factoryDAO');
var UserBO = require('../business/userBO');
var JWTHelper = require('../helpers/jwtHelper');
var ModelHelper = require('../helpers/modelHelper');
var DateHelper = require('../helpers/dateHelper');
var CryptoHelper = require('../helpers/cryptoHelper');
var FormPaymentBO = require('../business/formPaymentBO');
var TransactionBO = require('../business/transactionBO');

var jwtHelper = new JWTHelper();


function factory(business){
    switch (business){
        case 'user':
            return new UserBO({
                userDAO: DAOFactory.getDAO('user'),
                jwtHelper: jwtHelper,
                modelHelper: ModelHelper,
                cryptoHelper: CryptoHelper,
                dateHelper: DateHelper
            });
        case 'formPayment':
            return new FormPaymentBO({
                formPaymentDAO: DAOFactory.getDAO('formPayment'),
                transactionDAO: DAOFactory.getDAO('transaction'),
                modelHelper: ModelHelper,
                dateHelper: DateHelper
            });
        case 'transaction':
            return new TransactionBO({
                transactionDAO: DAOFactory.getDAO('transaction'),
                formPaymentBO: factory('formPayment'),
                userBO: factory('user'),
                modelHelper: ModelHelper,
                dateHelper: DateHelper
            });
    }
}

module.exports = {getBO: factory};
