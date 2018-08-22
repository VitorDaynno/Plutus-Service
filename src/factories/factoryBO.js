var DAOFactory = require('./factoryDAO');
var UserBO = require('../business/userBO');

function factory(business){
    switch (business){
        case 'user':
            return new UserBO({
                userDAO: DAOFactory.getDAO('user')
            });
    }
}

module.exports = {getBO: factory};
