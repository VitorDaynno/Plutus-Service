var Helper = require('../../helpers/jwtHelper');

module.exports = function(app) {
    var controller = app.controllers.transactions;
    var helper = new Helper();

    app.route('/v1/transactions')
        .post(helper.verifyToken, controller.add)
        .get(helper.verifyToken, controller.getAll);
};
