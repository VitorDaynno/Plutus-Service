var Helper = require('../../helpers/jwtHelper');

module.exports = function(app) {
    var controller = app.controllers.formPayment;
    var helper = new Helper();

    app.route('/v1/formspayment')
        .post(helper.verifyToken, controller.add);
};
