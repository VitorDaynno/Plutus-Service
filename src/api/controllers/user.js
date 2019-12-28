const logger = require('../../config/logger')('User-Controller');
const BOFactory = require('../../factories/factoryBO');

module.exports = function() {
  const business = BOFactory.getBO('user');

  return {
    auth: function(req, res) {
      logger.info('Auth a user by email ' + req.body.email);
      business.auth(req.body)
          .then(function(user) {
            res.send(user);
          })
          .catch(function(error) {
            res.status(error.code).json(error.message);
          });
    },

    getById: function(req, res) {
      logger.info('Getting user by id ' + req.params.id);
      const id = req.params.id ? req.params.id : null;
      business.getById({ id })
          .then(function(user) {
            res.send(user);
          })
          .catch(function(error) {
            res.status(error.code).json(error.message);
          });
    },

    save: function(req, res) {
      logger.info('Save a user');
      body = req.body ? req.body: {};
      business.save(body)
          .then(function(user) {
            res.status(201).json(user);
          })
          .catch(function(error) {
            res.status(error.code).json(error.message);
          });
    },

    getAll: function(req, res) {
      logger.info('Getting users');
      business.getAll()
          .then(function(users) {
            res.status(200).send(users);
          })
          .catch(function(error) {
            res.status(error.code).json(error.message);
          });
    },

    update: function(req, res) {
      logger.info('updating user by id ' + req.params.id);
      const id = req.params.id ? req.params.id : null;
      body = req.body ? req.body : {};
      body.id = id;
      business.update(body)
          .then(function(user) {
            res.send(user);
          })
          .catch(function(error) {
            res.status(error.code).json(error.message);
          });
    },

    delete: function(req, res) {
      logger.info('Deleting user by id ' + req.params.id);
      const id = req.params.id ? req.params.id : null;
      business.delete({ id })
          .then(function(user) {
            res.send(user);
          })
          .catch(function(error) {
            res.status(error.code).json(error.message);
          });
    },

  };
};
