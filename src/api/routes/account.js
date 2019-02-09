var Helper = require('../../helpers/jwtHelper');

module.exports = function(app) {
    var controller = app.controllers.account;
    var helper = new Helper();

    app.route('/v1/accounts')
        .post(helper.verifyToken, controller.add)
        .get(helper.verifyToken, controller.getAll);

    app.route('/v1/accounts/balances')
        .get(helper.verifyToken, controller.balances);
};
