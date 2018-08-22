var UserDAO = require('../daos/userDAO');

module.exports = {
    getDAO: function(dao){
        switch (dao) {
            case 'user':
                return new UserDAO();
        }
    }
};
