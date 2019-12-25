const logger = require('../config/logger')('UserBO');

module.exports = function(dependencies) {
  const dao = dependencies.userDAO;
  const jwt = dependencies.jwtHelper;
  const modelHelper = dependencies.modelHelper;
  const cryptoHelper = dependencies.cryptoHelper;
  const dateHelper = dependencies.dateHelper;

  return {
    dependencies: dependencies,

    auth: function(body) {
      let error = null;
      return new Promise(function(resolve, reject) {
        if (!body.email || !body.password) {
          logger.error('An error occurred because email or password not exist');
          error = { code: 422, message: 'Email and password are required' };
          reject(error);
        } else {
          const chain = Promise.resolve();
          chain
              .then(function() {
                return cryptoHelper.encrypt(body.password);
              })
              .then(function(password) {
                logger.info('Get user by email ' + body.email);
                return dao.getAll({
                  email: body.email,
                  password: password,
                  isEnabled: true,
                });
              })
              .then(function(user) {
                logger.info('The user are returned: ' + JSON.stringify(user));
                if (user.length > 0) {
                  return user[0];
                } else {
                  logger.error('Email or password are incorrect');
                  error = {
                    code: 401,
                    message: 'Email or password are incorrect',
                  };
                  throw error;
                };
              })
              .then(function(user) {
                return modelHelper.parseUser(user);
              })
              .then(function(user) {
                token = jwt.createToken(user);
                user.token = token;
                resolve(user);
              })
              .catch(function(error) {
                logger.error('An error occurred: ', error);
                reject(error);
              });
        };
      });
    },

    getById: function(body) {
      let error;
      return new Promise(function(resolve, reject) {
        const chain = Promise.resolve();
        chain
            .then(function() {
              if (!body || !body.id) {
                logger.error('An error occurred because field id not exist');
                error = { code: 422, message: 'Id are required' };
                throw error;
              }
            })
            .then(function() {
              logger.info('Getting user by id: '+ body.id);
              return dao.getById(body.id);
            })
            .then(function(user) {
              if (!user || !user._id) {
                logger.error('User not found by id: ' + body.id);
                return {};
              } else {
                logger.info('Parse user: ', user);
                return modelHelper.parseUser(user);
              }
            })
            .then(function(user) {
              resolve(user);
            })
            .catch(function(error) {
              logger.error('An error occurred: ', error);
              reject(error);
            });
      });
    },

    save: function(body) {
      let error;
      return new Promise(function(resolve, reject) {
        const chain = Promise.resolve();
        chain
            .then(function() {
              if (!body || !body.email) {
                logger.error('Email not found in: ' + JSON.stringify(body));
                error = { code: 422, message: 'Email are required' };
                throw error;
              }
              if (!body.name) {
                logger.error('Name not found in: ' + JSON.stringify(body));
                errr = { code: 422, message: 'Name are required' };
                throw error;
              }
              if (!body.password) {
                logger.error('Password not found in: ' + JSON.stringify(body));
                error = { code: 422, message: 'Password are required' };
                throw error;
              }
            })
            .then(function() {
              logger.info('Validating a email "' + body.email +'" in database');
              return dao.getAll({ email: body.email, isEnabled: true });
            })
            .then(function(user) {
              if (user && user.length > 0) {
                logger.error(`The email "${user.email}" is already be used`);
                error = {
                  code: 409,
                  message: 'Entered email is already being used',
                };
                throw error;
              }
            })
            .then(function() {
              logger.info('Encrypting a password of ' + body.name);
              return cryptoHelper.encrypt(body.password);
            })
            .then(function(password) {
              logger.info('Saving user in database');
              const user = {};
              user.name = body.name;
              user.email = body.email;
              user.password = password;
              user.isEnabled = true;
              user.creationDate = dateHelper.now();
              return dao.save(user);
            })
            .then(function(user) {
              logger.info('User save in database with success');
              return modelHelper.parseUser(user);
            })
            .then(function(user) {
              logger.info('User parsed by helper: '+ JSON.stringify(user));
              resolve(user);
            })
            .catch(function(error) {
              logger.error('An error occured: ' + error);
              reject(error);
            });
      });
    },

    update: function(body) {
      let error;
      return new Promise(function(resolve, reject) {
        const chain = Promise.resolve();
        chain
            .then(function() {
              logger.info('Validating user: '+ JSON.stringify(body));
              if (!body || !body.id) {
                logger.error('Id not found in: '+ JSON.stringify(body));
                error = { code: 422, message: 'Id are required' };
                throw error;
              }
            })
            .then(function() {
              logger.info('Updating user: ', body.id);
              const user = {};
              if (body.name || body.name !== '') {
                user.name = body.name;
                user.modificationDate= dateHelper.now();
              }
              return dao.update(body.id, user);
            })
            .then(function(user) {
              logger.info('User updated: ', user);
              if (!user || !user._id) {
                return {};
              }
              return modelHelper.parseUser(user);
            })
            .then(function(user) {
              logger.info('The user parsed: ', user);
              resolve(user);
            })
            .catch(function(error) {
              logger.error('An error occurred: ' + JSON.stringify(error));
              reject(error);
            });
      });
    },

    delete: function(body) {
      let error;
      return new Promise(function(resolve, reject) {
        const chain = Promise.resolve();
        chain
            .then(function() {
              logger.info('Delete user');
              if (!body || !body.id) {
                logger.error('Id not found in ' + JSON.stringify(body));
                error = { code: 422, message: 'Id are required' };
                throw error;
              }
            })
            .then(function() {
              logger.info('Delete user by id: ', body.id);
              const user = {};
              user.isEnabled = false;
              user.exclusionDate = dateHelper.now();
              return dao.delete(body.id, user);
            })
            .then(function() {
              resolve({});
            })
            .catch(function(error) {
              logger.error('An error occurred: ' + JSON.stringify(error));
              reject(error);
            });
      });
    },
  };
};
