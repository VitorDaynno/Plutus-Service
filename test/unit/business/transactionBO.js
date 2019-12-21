const chai = require('chai');
const sinon = require('sinon');
const mocha = require('mocha')

const expect = chai.expect;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;
const it = mocha.it;

const TransactionBO = require('../../../src/business/transactionBO');
const DAOFactory = require('../../../src/factories/factoryDAO');
const BusinessFactory = require('../../../src/factories/factoryBO');
const ModelHelper = require('../../../src/helpers/modelHelper');
const DateHelper = require('../../../src/helpers/dateHelper');
const LodashHelper = require('../../../src/helpers/lodashHelper');


describe('TransactionBO', function() {
  const transactionDAO = DAOFactory.getDAO('transaction');
  const accountBO = BusinessFactory.getBO('account');
  const userBO = BusinessFactory.getBO('user');

  let getAccountByIdStub;
  let getUserByIdStub;
  let saveStub;
  let getAllStub;
  let parseTransactionStub;
  let deleteStub;
  let nowStub;
  let date;
  let updateStub;

  const transactionBO = new TransactionBO({
    transactionDAO: transactionDAO,
    accountBO: accountBO,
    userBO: userBO,
    modelHelper: ModelHelper,
    dateHelper: DateHelper,
    lodashHelper: LodashHelper,
  });

  beforeEach(function() {
    getAccountByIdStub = sinon.stub(accountBO, 'getById');
    getUserByIdStub = sinon.stub(userBO, 'getById');
    saveStub = sinon.stub(transactionDAO, 'save');
    getAllStub = sinon.stub(transactionDAO, 'getAll');
    parseTransactionStub = sinon.stub(ModelHelper, 'parseTransaction');
    deleteStub = sinon.stub(transactionDAO, 'delete');
    nowStub = sinon.stub(DateHelper, 'now');
    updateStub = sinon.stub(transactionDAO, 'update');
    date = new Date();
    nowStub
        .returns(date);
  });

  afterEach(function() {
    getAccountByIdStub.restore();
    getUserByIdStub.restore();
    saveStub.restore();
    getAllStub.restore();
    parseTransactionStub.restore();
    deleteStub.restore();
    nowStub.restore();
    updateStub.restore();
  });

  describe('add', function() {
    it('Should return error because Description does not informed', function() {
      getAccountByIdStub
          .withArgs({})
          .returns({});

      saveStub
          .withArgs({})
          .returns({});

      parseTransactionStub
          .withArgs({})
          .returns({});

      return transactionBO
          .add({
            value: -33.9,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
          })
          .then()
          .catch(function(error) {
            expect(getAccountByIdStub.callCount).to.be.equals(0);
            expect(saveStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(error.code).to.be.equals(422);
            expect(error.message)
                .to
                .be
                .equals('The entity should has a field description');
          });
    });
    it('Should return error because Value does not informed', function() {
      getAccountByIdStub
          .withArgs({})
          .returns({});

      saveStub
          .withArgs({})
          .returns({});

      parseTransactionStub
          .withArgs({})
          .returns({});

      return transactionBO
          .add({
            description: 'Tênis',
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
          })
          .then()
          .catch(function(error) {
            expect(getAccountByIdStub.callCount).to.be.equals(0);
            expect(saveStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(error.code).to.be.equals(422);
            expect(error.message)
                .to
                .be
                .equals('The entity should has a field value');
          });
    });
    it('Should return error because Categories does not informed', function() {
      getAccountByIdStub
          .withArgs({})
          .returns({});

      saveStub
          .withArgs({})
          .returns({});

      parseTransactionStub
          .withArgs({})
          .returns({});

      return transactionBO
          .add({
            description: 'Tênis',
            value: -33.9,
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
          })
          .then()
          .catch(function(error) {
            expect(getAccountByIdStub.callCount).to.be.equals(0);
            expect(saveStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(error.code).to.be.equals(422);
            expect(error.message)
                .to
                .be
                .equals('The entity should has a field categories');
          });
    });
    it('Should return error because PurchaseDate does not informed',
        function() {
          getAccountByIdStub
              .withArgs({})
              .returns({});

          saveStub
              .withArgs({})
              .returns({});

          parseTransactionStub
              .withArgs({})
              .returns({});

          return transactionBO
              .add({
                description: 'Tênis',
                value: -99.0,
                categories: ['Vestuário'],
                account: '507f1f77bcf86cd799439011',
              })
              .then()
              .catch(function(error) {
                expect(getAccountByIdStub.callCount).to.be.equals(0);
                expect(saveStub.callCount).to.be.equals(0);
                expect(parseTransactionStub.callCount).to.be.equals(0);
                expect(error.code).to.be.equals(422);
                expect(error.message)
                    .to
                    .be
                    .equals('The entity should has a field purchaseDate');
              });
        });
    it('Should return error because Account does not informed', function() {
      getAccountByIdStub
          .withArgs({})
          .returns({});

      saveStub
          .withArgs({})
          .returns({});

      parseTransactionStub
          .withArgs({})
          .returns({});

      return transactionBO
          .add({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
          })
          .then()
          .catch(function(error) {
            expect(getAccountByIdStub.callCount).to.be.equals(0);
            expect(saveStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(error.code).to.be.equals(422);
            expect(error.message)
                .to
                .be
                .equals('The entity should has a field Account');
          });
    });
    it('Should return error because Account are not found', function() {
      getAccountByIdStub
          .withArgs({ id: '507f1f77bcf86cd799439010' })
          .returns({});

      saveStub
          .withArgs({})
          .returns({});

      parseTransactionStub
          .withArgs({})
          .returns({});

      return transactionBO
          .add({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439010',
          })
          .then()
          .catch(function(error) {
            expect(getAccountByIdStub.callCount).to.be.equals(1);
            expect(saveStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(error.code).to.be.equals(404);
            expect(error.message).to.be.equals('The account not found');
          });
    });
    it('Should add a transactions', function() {
      nowStub
          .returns(new Date(1546665448555));

      getAccountByIdStub
          .withArgs({ id: '507f1f77bcf86cd799439011' })
          .returns({
            id: '507f1f77bcf86cd799439011',
            name: 'Débito',
            type: 'debitCard',
          });

      saveStub
          .withArgs({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
            isEnabled: true,
            creationDate: DateHelper.now(),
          })
          .returns({
            _id: 1,
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928385),
            account: '507f1f77bcf86cd799439011',
            isEnabled: true,
            creationDate: DateHelper.now(),
          });

      parseTransactionStub
          .withArgs({
            _id: 1,
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928385),
            account: '507f1f77bcf86cd799439011',
            isEnabled: true,
            creationDate: DateHelper.now(),
          })
          .returns({
            id: 1,
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928385),
            account: '507f1f77bcf86cd799439011',
          });

      return transactionBO
          .add({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
          })
          .then(function(transaction) {
            expect(getAccountByIdStub.callCount).to.be.equals(1);
            expect(saveStub.callCount).to.be.equals(1);
            expect(parseTransactionStub.callCount).to.be.equals(1);
            expect(transaction).to.be.eqls({
              id: 1,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928385),
              account: '507f1f77bcf86cd799439011',
            });
          });
    });
    it(`Should add a transactions with the number of installments greater than 
      zero`,
    function() {
      nowStub
          .returns(new Date(1546665448557));

      getAccountByIdStub
          .withArgs({ id: '507f1f77bcf86cd799439012' })
          .returns({
            id: '507f1f77bcf86cd799439012',
            name: 'credit',
            type: 'credit',
          });

      saveStub
          .returns({
            _id: 3,
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928785),
            account: '507f1f77bcf86cd799439012',
            installments: 5,
            isEnabled: true,
            creationDate: DateHelper.now(),
          });

      const cloneStub = sinon.stub(LodashHelper, 'clone')
          .returns({
            _id: 3,
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928785),
            account: '507f1f77bcf86cd799439012',
            installments: 5,
            isEnabled: true,
            creationDate: DateHelper.now(),
          });

      parseTransactionStub
          .withArgs({
            _id: 3,
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928785),
            account: '507f1f77bcf86cd799439012',
            installments: 5,
            isEnabled: true,
            creationDate: DateHelper.now(),
          })
          .returns({
            id: 3,
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928785),
            account: '507f1f77bcf86cd799439012',
            installments: 5,
          });

      return transactionBO
          .add({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928785),
            account: '507f1f77bcf86cd799439012',
            installments: 5,
          })
          .then(function(transaction) {
            expect(transaction).to.be.eqls({
              id: 3,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: '507f1f77bcf86cd799439012',
              installments: 5,
            });
            expect(getAccountByIdStub.callCount).to.be.equals(1);
            expect(saveStub.callCount).to.be.equal(6);
            expect(cloneStub.callCount).to.be.equal(5);
            expect(parseTransactionStub.callCount).to.be.equals(1);
            cloneStub.restore();
          });
    });
  });

  describe('getAll', function() {
    it('Should return error because body does not exists', function() {
      getUserByIdStub
          .withArgs({ id: 22 })
          .returns({ code: 404, message: 'User not found' });

      getAllStub
          .withArgs({ userId: 21, isEnabled: true })
          .returns([]);

      return transactionBO.getAll()
          .then()
          .catch(function(error) {
            expect(error.code).to.be.equals(422);
            expect(error.message).to.be.equals('UserId is required');
            expect(getUserByIdStub.callCount).to.be.equals(0);
            expect(getAllStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
          });
    });
    it('Should return error because userId does not exists', function() {
      getUserByIdStub
          .withArgs({ id: 22 })
          .returns({ code: 404, message: 'User not found' });

      getAllStub
          .withArgs({ userId: 21, isEnabled: true })
          .returns([]);

      return transactionBO.getAll({})
          .then()
          .catch(function(error) {
            expect(error.code).to.be.equals(422);
            expect(error.message).to.be.equals('UserId is required');
            expect(getUserByIdStub.callCount).to.be.equals(0);
            expect(getAllStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
          });
    });
    it('Should return zero transactions if userId does not exists', function() {
      getUserByIdStub
          .withArgs({ id: 22 })
          .returns({});

      getAllStub
          .withArgs({ userId: 21, isEnabled: true })
          .returns([]);

      return transactionBO.getAll({ userId: 22 })
          .then(function(transactions) {
            expect(transactions.length).to.be.equals(0);
            expect(getUserByIdStub.callCount).to.be.equals(1);
            expect(getAllStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
          });
    });
    it('Should return zero transactions by valid user', function() {
      getUserByIdStub
          .withArgs({ id: 21 })
          .returns({ id: 21, name: 'test', email: 'test@test.com' });

      getAllStub
          .withArgs({ userId: 21, isEnabled: true })
          .returns([]);

      parseTransactionStub
          .withArgs([])
          .returns([]);

      return transactionBO.getAll({ userId: 21 })
          .then(function(transactions) {
            expect(transactions.length).to.be.equal(0);
            expect(getUserByIdStub.callCount).to.be.equal(1);
            expect(getAllStub.callCount).to.be.equal(1);
            expect(parseTransactionStub.callCount).to.be.equals(1);
          });
    });
    it('Should return a transactions by valid user', function() {
      nowStub
          .returns(new Date(1546665448552));

      getUserByIdStub
          .withArgs({ id: 22 })
          .returns({ id: 22, name: 'test', email: 'test@test.com' });

      getAllStub
          .withArgs({ userId: 22, isEnabled: true })
          .returns([
            { _id: 3,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 4,
              description: 'Tênis 2',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 5,
              description: 'Tênis 3',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
          ]);

      parseTransactionStub
          .withArgs([
            {
              _id: 3,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 4,
              description: 'Tênis 2',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 5,
              description: 'Tênis 3',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            }])
          .returns([
            {
              id: 3,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              id: 4,
              description: 'Tênis 2',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              id: 5,
              description: 'Tênis 3',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
          ]);

      return transactionBO.getAll({ userId: 22 })
          .then(function(transactions) {
            expect(transactions.length).to.be.equals(3);
            expect(transactions[0]).has.to.property('id');
            expect(transactions[0].account).to.be.eqls({
              id: '507f1f77bcf86cd799439012',
              name: 'Card 1',
              type: 'credit',
            });
            expect(getUserByIdStub.callCount).to.be.equals(1);
            expect(getAllStub.callCount).to.be.equals(1);
            expect(nowStub.callCount).to.be.equal(9);
            expect(parseTransactionStub.callCount).to.be.equals(1);
          });
    });
    it('Should return only credit transactions by valid user', function() {
      nowStub
          .returns(new Date(1546665448552));

      getUserByIdStub
          .withArgs({ id: 22 })
          .returns({ id: 22, name: 'test', email: 'test@test.com' });

      getAllStub
          .withArgs({ userId: 22, isEnabled: true })
          .returns([
            {
              _id: 2,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'money',
                type: 'physic',
              },
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 3,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 4,
              description: 'Tênis 2',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 5,
              description: 'Tênis 3',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 6,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'money',
                type: 'physic',
              },
              isEnabled: true,
              creationDate: DateHelper.now(),
            }]);

      parseTransactionStub
          .withArgs([
            {
              _id: 3,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 4,
              description: 'Tênis 2',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              _id: 5,
              description: 'Tênis 3',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            }])
          .returns([
            {
              id: 3,
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              id: 4,
              description: 'Tênis 2',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            },
            {
              id: 5,
              description: 'Tênis 3',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(1537058928785),
              account: {
                id: '507f1f77bcf86cd799439012',
                name: 'Card 1',
                type: 'credit',
              },
              installments: 5,
              isEnabled: true,
              creationDate: DateHelper.now(),
            }]);

      return transactionBO.getAll({ userId: 22, onlyCredit: '1' })
          .then(function(transactions) {
            expect(transactions.length).to.be.equals(3);
            expect(transactions[0].account).to.be.eqls({
              id: '507f1f77bcf86cd799439012',
              name: 'Card 1',
              type: 'credit',
            });
            expect(getUserByIdStub.callCount).to.be.equals(1);
            expect(getAllStub.callCount).to.be.equals(1);
            expect(nowStub.callCount).to.be.equal(11);
            expect(parseTransactionStub.callCount).to.be.equals(1);
          });
    });
  });

  describe('delete', function() {
    it('Should return error when body does not exist', function() {
      return transactionBO.delete()
          .then()
          .catch(function(error) {
            expect(error.code).to.be.equals(422);
            expect(error.message).to.be.equals('Id are required');
            expect(deleteStub.callCount).to.be.equals(0);
            expect(nowStub.callCount).to.be.equals(0);
          });
    });

    it('Should return error when body does contains id', function() {
      return transactionBO.delete({})
          .then()
          .catch(function(error) {
            expect(error.code).to.be.equals(422);
            expect(error.message).to.be.equals('Id are required');
            expect(deleteStub.callCount).to.be.equals(0);
            expect(nowStub.callCount).to.be.equals(0);
          });
    });

    it('Should delete a user', function() {
      deleteStub
          .withArgs(
              { id: '5c088673fb2f579adcca9ed1' },
              { isEnabled: false, exclusionDate: date }
          )
          .returns({});

      return transactionBO.delete({ id: '5c088673fb2f579adcca9ed1' })
          .then(function() {
            expect(deleteStub.callCount).to.be.equals(1);
            expect(nowStub.callCount).to.be.equals(1);
          });
    });
  });

  describe('update', function() {
    it('Should return error when body does not exist', function() {
      return transactionBO.update()
          .then()
          .catch(function(error) {
            expect(error.code).to.be.equals(422);
            expect(error.message).to.be.equals('Id are required');
            expect(updateStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(nowStub.callCount).to.be.equals(0);
            parseTransactionStub.restore();
          });
    });

    it('Should return error when body does contains id', function() {
      return userBO.update({ description: 'tests' })
          .then()
          .catch(function(error) {
            expect(error.code).to.be.equals(422);
            expect(error.message).to.be.equals('Id are required');
            expect(updateStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(nowStub.callCount).to.be.equals(0);
          });
    });

    it('Should return error when try update installments', function() {
      return transactionBO
          .update({
            id: '5c088673fb2f579adcca9ed1',
            installments: 7,
          })
          .then()
          .catch(function(error) {
            expect(error.code).to.be.equal(406);
            expect(error.message).to.be.equal('Installments can\'t be updated');
            expect(updateStub.callCount).to.be.equals(0);
            expect(parseTransactionStub.callCount).to.be.equals(0);
            expect(nowStub.callCount).to.be.equals(0);
            updateStub.restore();
            parseTransactionStub.restore();
          });
    });

    it('Should return a transaction when update description with success',
        function() {
          updateStub
              .withArgs(
                  '5c088673fb2f579adcca9ed1',
                  { description: 'changeName', modificationDate: date }
              )
              .returns({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: -99.0,
                categories: ['Vestuário'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              });

          parseTransactionStub
              .withArgs({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: -99.0,
                categories: ['Vestuário'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              })
              .returns({
                id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: -99.0,
                categories: ['Vestuário'],
                purchaseDate: date,
                account: {
                  id: '507f1f77bcf86cd799439012',
                  name: 'Card 1',
                  type: 'credit',
                },
                installments: 5,
                creationDate: date,
                modificationDate: date,
              });

          return transactionBO
              .update({
                id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
              })
              .then(function(transaction) {
                expect(transaction).to.be.eqls({
                  id: '5c088673fb2f579adcca9ed1',
                  description: 'changeName',
                  value: -99.0,
                  categories: ['Vestuário'],
                  purchaseDate: date,
                  account: {
                    id: '507f1f77bcf86cd799439012',
                    name: 'Card 1',
                    type: 'credit',
                  },
                  installments: 5,
                  creationDate: date,
                  modificationDate: date,
                });
                expect(updateStub.callCount).to.be.equals(1);
                expect(parseTransactionStub.callCount).to.be.equals(1);
                expect(nowStub.callCount).to.be.equals(1);
                updateStub.restore();
                parseTransactionStub.restore();
              });
        });

    it('Should return a transaction when update value with success',
        function() {
          updateStub
              .withArgs(
                  '5c088673fb2f579adcca9ed1',
                  { value: 10, modificationDate: date }
              )
              .returns({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              });

          parseTransactionStub
              .withArgs({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              })
              .returns({
                id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário'],
                purchaseDate: date,
                account: {
                  id: '507f1f77bcf86cd799439012',
                  name: 'Card 1',
                  type: 'credit',
                },
                installments: 5,
                creationDate: date,
                modificationDate: date,
              });

          return transactionBO
              .update({
                id: '5c088673fb2f579adcca9ed1',
                value: 10,
              })
              .then(function(transaction) {
                expect(transaction).to.be.eqls({
                  id: '5c088673fb2f579adcca9ed1',
                  description: 'changeName',
                  value: 10.0,
                  categories: ['Vestuário'],
                  purchaseDate: date,
                  account: {
                    id: '507f1f77bcf86cd799439012',
                    name: 'Card 1',
                    type: 'credit',
                  },
                  installments: 5,
                  creationDate: date,
                  modificationDate: date,
                });
                expect(updateStub.callCount).to.be.equals(1);
                expect(parseTransactionStub.callCount).to.be.equals(1);
                expect(nowStub.callCount).to.be.equals(1);
                updateStub.restore();
                parseTransactionStub.restore();
              });
        });

    it('Should return a transaction when update categories with success',
        function() {
          updateStub
              .withArgs(
                  '5c088673fb2f579adcca9ed1',
                  {
                    categories: ['Vestuário', 'Calçados'],
                    modificationDate: date,
                  }
              )
              .returns({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              });

          parseTransactionStub
              .withArgs({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              })
              .returns({
                id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: {
                  id: '507f1f77bcf86cd799439012',
                  name: 'Card 1',
                  type: 'credit',
                },
                installments: 5,
                creationDate: date,
                modificationDate: date,
              });

          return transactionBO
              .update({
                id: '5c088673fb2f579adcca9ed1',
                categories: ['Vestuário', 'Calçados'],
              })
              .then(function(transaction) {
                expect(transaction).to.be.eqls({
                  id: '5c088673fb2f579adcca9ed1',
                  description: 'changeName',
                  value: 10.0,
                  categories: ['Vestuário', 'Calçados'],
                  purchaseDate: date,
                  account: {
                    id: '507f1f77bcf86cd799439012',
                    name: 'Card 1',
                    type: 'credit',
                  },
                  installments: 5,
                  creationDate: date,
                  modificationDate: date,
                });
                expect(updateStub.callCount).to.be.equals(1);
                expect(parseTransactionStub.callCount).to.be.equals(1);
                expect(nowStub.callCount).to.be.equals(1);
                updateStub.restore();
                parseTransactionStub.restore();
              });
        });

    it('Should return a transaction when update purchaseDate with success',
        function() {
          updateStub
              .withArgs(
                  '5c088673fb2f579adcca9ed1',
                  { purchaseDate: date, modificationDate: date }
              )
              .returns({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              });

          parseTransactionStub
              .withArgs({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              })
              .returns({
                id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: {
                  id: '507f1f77bcf86cd799439012',
                  name: 'Card 1',
                  type: 'credit',
                },
                installments: 5,
                creationDate: date,
                modificationDate: date,
              });

          return transactionBO
              .update({
                id: '5c088673fb2f579adcca9ed1',
                categories: ['Vestuário', 'Calçados'],
              })
              .then(function(transaction) {
                expect(transaction).to.be.eqls({
                  id: '5c088673fb2f579adcca9ed1',
                  description: 'changeName',
                  value: 10.0,
                  categories: ['Vestuário', 'Calçados'],
                  purchaseDate: date,
                  account: {
                    id: '507f1f77bcf86cd799439012',
                    name: 'Card 1',
                    type: 'credit',
                  },
                  installments: 5,
                  creationDate: date,
                  modificationDate: date,
                });
                expect(updateStub.callCount).to.be.equals(1);
                expect(parseTransactionStub.callCount).to.be.equals(1);
                expect(nowStub.callCount).to.be.equals(1);
                updateStub.restore();
                parseTransactionStub.restore();
              });
        });

    it('Should return a transaction when update account with success',
        function() {
          updateStub
              .withArgs(
                  '5c088673fb2f579adcca9ed1',
                  {
                    account: '507f1f77bcf86cd799439013',
                    modificationDate: date,
                  }
              )
              .returns({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439013',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              });

          parseTransactionStub
              .withArgs({
                _id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439012',
                installments: 5,
                isEnabled: true,
                creationDate: date,
                modificationDate: date,
              })
              .returns({
                id: '5c088673fb2f579adcca9ed1',
                description: 'changeName',
                value: 10.0,
                categories: ['Vestuário', 'Calçados'],
                purchaseDate: date,
                account: '507f1f77bcf86cd799439013',
                installments: 5,
                creationDate: date,
                modificationDate: date,
              });

          return transactionBO
              .update({
                id: '5c088673fb2f579adcca9ed1',
                categories: ['Vestuário', 'Calçados'],
              })
              .then(function(transaction) {
                expect(transaction).to.be.eqls({
                  id: '5c088673fb2f579adcca9ed1',
                  description: 'changeName',
                  value: 10.0,
                  categories: ['Vestuário', 'Calçados'],
                  purchaseDate: date,
                  account: '507f1f77bcf86cd799439013',
                  installments: 5,
                  creationDate: date,
                  modificationDate: date,
                });
                expect(updateStub.callCount).to.be.equals(1);
                expect(parseTransactionStub.callCount).to.be.equals(1);
                expect(nowStub.callCount).to.be.equals(1);
                updateStub.restore();
                parseTransactionStub.restore();
              });
        });
  });
});
