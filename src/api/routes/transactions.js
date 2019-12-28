const Helper = require('../../helpers/jwtHelper');

module.exports = function(app) {
  const controller = app.controllers.transactions;
  const helper = new Helper();

  app.route('/v1/transactions')
      .post(helper.verifyToken, controller.add)
      .get(helper.verifyToken, controller.getAll);

  app.route('/v1/transactions/:id')
      .put(helper.verifyToken, controller.update)
      .delete(helper.verifyToken, controller.delete);
};
