const Helper = require('../../helpers/jwtHelper');

module.exports = function(app) {
  const controller = app.controllers.user;
  const helper = new Helper();

  app.route('/v1/users/auth')
      .post(controller.auth);

  app.route('/v1/users')
      .post(helper.verifyToken, controller.save)
      .get(helper.verifyToken, controller.getAll);

  app.route('/v1/users/:id')
      .get(helper.verifyToken, controller.getById)
      .put(helper.verifyToken, controller.update)
      .delete(helper.verifyToken, controller.delete);
};
