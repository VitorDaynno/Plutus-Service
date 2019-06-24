var DAOFactory = require('./factoryDAO');
var UserBO = require('../business/userBO');
var JWTHelper = require('../helpers/jwtHelper');
var ModelHelper = require('../helpers/modelHelper');
var DateHelper = require('../helpers/dateHelper');
var CryptoHelper = require('../helpers/cryptoHelper');
var AccountBO = require('../business/accountBO');
var TransactionBO = require('../business/transactionBO');
var LodashHelper = require('../helpers/lodashHelper');

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
        case 'account':
            return new AccountBO({
                accountDAO: DAOFactory.getDAO('account'),
                transactionDAO: DAOFactory.getDAO('transaction'),
                modelHelper: ModelHelper,
                dateHelper: DateHelper
            });
        case 'transaction':
            return new TransactionBO({
                transactionDAO: DAOFactory.getDAO('transaction'),
                accountBO: factory('account'),
                userBO: factory('user'),
                modelHelper: ModelHelper,
                dateHelper: DateHelper,
                lodashHelper: LodashHelper
            });
    }
}

module.exports = {getBO: factory};
