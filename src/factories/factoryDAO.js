var UserDAO = require('../daos/userDAO');
var userModel = require('../models/user')();

module.exports = {
    getDAO: function(dao){
        switch (dao) {
            case 'user':
                return new UserDAO({
                    user: userModel
                });
        }
    }
};
