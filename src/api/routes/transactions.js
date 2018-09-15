module.exports = function(app) {
    var controller = app.controllers.transactions;

    app.route('/v1/transactions')
        .post(controller.add);
};
