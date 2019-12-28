const logger = require('../config/logger')('TransactionBO');

module.exports = function(dependencies) {
  const dao = dependencies.transactionDAO;
  const accountBO = dependencies.accountBO;
  const userBO = dependencies.userBO;
  const modelHelper = dependencies.modelHelper;
  const dateHelper = dependencies.dateHelper;
  const lodashHelper = dependencies.lodashHelper;

  return {
    dependencies: dependencies,

    add: function(transaction) {
      let error = null;
      return new Promise(function(resolve, reject) {
        const chain = Promise.resolve();
        chain
            .then(function() {
              if (!transaction.description) {
                logger.error('An error occurred because Description not exist');
                error = {
                  code: 422,
                  message: 'The entity should has a field description',
                };
                throw error;
              }
              if (!transaction.value) {
                logger.error('An error occurred because Value not exist');
                error = {
                  code: 422,
                  message: 'The entity should has a field value',
                };
                throw error;
              }
              if (!transaction.categories) {
                logger.error('An error occurred because Categories not exist');
                error = {
                  code: 422,
                  message: 'The entity should has a field categories',
                };
                throw error;
              }
              if (!transaction.purchaseDate) {
                logger
                    .error('An error occurred because PurchaseDate not exist');
                error = {
                  code: 422,
                  message: 'The entity should has a field purchaseDate',
                };
                throw error;
              }
              if (!transaction.account) {
                logger.error('An error occurred because Account not exist');
                error = {
                  code: 422,
                  message: 'The entity should has a field Account',
                };
                throw error;
              }
            })
            .then(function() {
              logger.info('Getting account by id ' + transaction.account);
              return accountBO.getById({ id: transaction.account });
            })
            .then(function(account) {
              logger.info('A account are returned ' + JSON.stringify(account));
              if (!account.id) {
                error = { code: 404, message: 'The account not found' };
                throw error;
              }
            })
            .then(function() {
              logger.info('A transaction will be inserted');
              transaction.isEnabled = true;
              transaction.creationDate = dateHelper.now();
              return dao.save(transaction);
            })
            .then(function(transaction) {
              logger.info('A transaction was inserted: ', transaction);
              const p = [];
              if (transaction && transaction.installments) {
                for (let i = 0; i < transaction.installments; i++) {
                  const installmentsTransaction = lodashHelper
                      .clone(transaction);
                  delete installmentsTransaction.installments;
                  delete installmentsTransaction._id;
                  const originalDate = transaction.purchaseDate;
                  const date = new Date(originalDate.getFullYear(),
                      originalDate.getMonth() + i,
                      originalDate.getDate()
                  );
                  installmentsTransaction.purchaseDate = date;
                  logger
                      .info(
                          'A installment transaction will be inserted: ',
                          installmentsTransaction
                      );
                  p.push(dao.save(installmentsTransaction));
                }
              }
              return transaction;
            })
            .then(function(transaction) {
              return modelHelper.parseTransaction(transaction);
            })
            .then(function(transaction) {
              resolve(transaction);
            })
            .catch(function(error) {
              logger.error('An error occurred ', error);
              reject(error);
            });
      });
    },

    getAll: function(body) {
      let error;
      return new Promise(function(resolve, reject) {
        const chain = Promise.resolve();
        chain
            .then(function() {
              if (!body || !body.userId) {
                logger.error('An error occurred because UserId not exist');
                error = { code: 422, message: 'UserId is required' };
                throw error;
              }
            })
            .then(function() {
              logger.info('Getting user by id: ' + body.userId);
              return userBO.getById({ id: body.userId });
            })
            .then(function(user) {
              if (!user || !user.id) {
                logger.info('User not found by id: ' + body.userId);
                resolve([]);
              } else {
                logger.info('Getting transactions by userId: ' + body.userId);
                const filter = { userId: body.userId, isEnabled: true };

                return dao.getAll(filter);
              }
            })
            .then(function(transactions) {
              logger
                  .info(
                      'The transactions returned: ' +
                      JSON.stringify(transactions)
                  );
              if (!body.onlyCredit || body.onlyCredit !== '1') {
                return transactions;
              }
              if (body.onlyCredit && body.onlyCredit === '1') {
                logger.info('Filtering transactions of credit');
                const filteredTransactions = transactions
                    .filter(function(transaction) {
                      if (transaction.account.type === 'credit') {
                        return transaction;
                      }
                    });
                logger
                    .info(
                        'Returns the filteredTransactions: ' +
                        JSON.stringify(filteredTransactions)
                    );
                return filteredTransactions;
              }
            })
            .then(function(transactions) {
              logger
                  .info(
                      'The transactions returned: ' +
                      JSON.stringify(transactions)
                  );
              return modelHelper.parseTransaction(transactions);
            })
            .then(function(transactions) {
              logger
                  .info(
                      'The parsed transactions returned: ' +
                      JSON.stringify(transactions)
                  );
              resolve(transactions);
            })
            .catch(function(error) {
              logger.error('An error occurred: ', error);
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
              logger.info('Delete transaction');
              if (!body || !body.id) {
                logger.error('Id not found in ' + JSON.stringify(body));
                error = { code: 422, message: 'Id are required' };
                throw error;
              }
            })
            .then(function() {
              logger.info('Delete transaction by id: ', body.id);
              const transaction = {};
              transaction.isEnabled = false;
              transaction.exclusionDate = dateHelper.now();
              return dao.delete(body.id, transaction);
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

    update: function(body) {
      let error;
      return new Promise(function(resolve, reject) {
        const chain = Promise.resolve();
        chain
            .then(function() {
              logger.info('Validating transaction: '+ JSON.stringify(body));
              if (!body || !body.id) {
                logger.error('Id not found in: '+JSON.stringify(body));
                error = { code: 422, message: 'Id are required' };
                throw error;
              }
              if (body.installments) {
                error = {
                  code: 406,
                  message: 'Installments can\'t be updated',
                };
                throw error;
              }
            })
            .then(function() {
              logger.info('Updating transaction: '+ body.id);
              const transaction = {};
              if (body.description && body.description !== '') {
                transaction.description = body.description;
              }
              if (body.value) {
                transaction.value = body.value;
              }
              if (body.categories && Array.isArray(body.categories)) {
                transaction.categories = body.categories;
              }
              if (body.purchaseDate) {
                transaction.purchaseDate = body.purchaseDate;
              }
              if (body.account && body.account !== '') {
                transaction.account = body.account;
              }
              return transaction;
            })
            .then(function(transaction) {
              transaction.modificationDate = dateHelper.now();
              return dao.update(body.id, transaction);
            })
            .then(function(transaction) {
              logger.info('Transaction updated: '+JSON.stringify(transaction));
              if (!transaction || !transaction._id) {
                return {};
              }
              return modelHelper.parseTransaction(transaction);
            })
            .then(function(transaction) {
              logger
                  .info('The transaction parsed: '+JSON.stringify(transaction));
              resolve(transaction);
            })
            .catch(function(error) {
              logger.error('An error occurred: ' + JSON.stringify(error));
              reject(error);
            });
      });
    },
  };
};
