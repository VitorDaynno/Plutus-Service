module.exports = function(app) {
    var controller = app.controllers.user;

    app.route('/v1/users/auth')
        .post(controller.auth);
};
