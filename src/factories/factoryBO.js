var DAOFactory = require('./factoryDAO');
var UserBO = require('../business/userBO');
var JWTHelper = require('../helpers/jwtHelper');
var jwtHelper = new JWTHelper();

function factory(business){
    switch (business){
        case 'user':
            return new UserBO({
                userDAO: DAOFactory.getDAO('user'),
                jwtHelper: jwtHelper
            });
    }
}

module.exports = {getBO: factory};
