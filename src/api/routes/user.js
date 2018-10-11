module.exports = function(app) {
    var controller = app.controllers.user;

    app.route('/v1/users/auth')
        .post(controller.auth);

    app.route('/v1/users/:id')
        .get(controller.getById);
};
