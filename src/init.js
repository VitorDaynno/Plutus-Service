const logger = require('./config/logger')('Init');
const BOFactory = require('./factories/factoryBO');

module.exports = function() {
  logger.info('Starting init');
  const userBO = BOFactory.getBO('user');
  const chain = Promise.resolve();

  chain
      .then(function() {
        logger.info('Verifying if user exist');
        return userBO.getAll();
      })
      .then(function(users) {
        if (users && users.length === 0) {
          logger.info('User admin not found and user admin will be created');
          const user = {
            name: 'admin',
            email: 'admin@plutus.com.br',
            password: '1234',
          };
          return userBO.save(user);
        }
      });
};
