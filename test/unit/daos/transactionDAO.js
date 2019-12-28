const chai = require('chai');
const mocha = require('mocha');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');

const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;

const TransactionDAO = require('../../../src/daos/transactionDAO');
const transactionModel = require('../../../src/models/transaction')();
const dateHelper = require('../../../src/helpers/dateHelper');

describe('transactionDAO', function() {
  const transactionDAO = new TransactionDAO({
    transaction: transactionModel,
  });

  let date;
  let nowStub;

  beforeEach(function() {
    nowStub = sinon.stub(dateHelper, 'now');
  });

  afterEach(function() {
    nowStub.restore();
  });

  describe('save', function() {
    it('Should return a error when a document can not cast', function() {
      nowStub
          .returns(new Date(1546665448537));

      const createStub = sinon.mock(transactionModel).expects('create')
          .withArgs('error')
          .rejects({ name: 'CastError' });

      return transactionDAO.save('error')
          .catch(function() {
            expect(createStub.callCount).to.be.equals(1);
            sinon.restore();
            nowStub.restore();
          });
    });
    it('Should return a error when a document contain error of validation',
        function() {
          nowStub
              .returns(new Date(1546665448537));

          const createStub = sinon.mock(transactionModel).expects('create')
              .withArgs({
                value: -99.0,
                categories: ['Vestuário'],
                date: dateHelper.now(),
                account: '507f1f77bcf86cd799439010',
                isEnabled: true,
                creationDate: dateHelper.now(),
              })
              .rejects({ name: 'ValidadeError' });

          return transactionDAO
              .save({
                value: -99.0,
                categories: ['Vestuário'],
                date: dateHelper.now(),
                account: '507f1f77bcf86cd799439010',
                isEnabled: true,
                creationDate: dateHelper.now(),
              })
              .catch(function() {
                expect(createStub.callCount).to.be.equals(1);
                sinon.restore();
                nowStub.restore();
              });
        });
    it(`Should return a transaction when a document transaction contain all 
        fields`,
    function() {
      nowStub
          .returns(new Date(1546665448537));

      const createStub = sinon.mock(transactionModel).expects('create')
          .withArgs({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            date: dateHelper.now(),
            account: '507f1f77bcf86cd799439010',
            isEnabled: true,
            creationDate: dateHelper.now(),
          })
          .resolves({
            _id: '507f1f77bcf86cd799439012',
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            date: dateHelper.now(),
            account: {
              _id: '507f1f77bcf86cd799439010',
              name: 'Card 1',
              type: 'credit',
              isEnabled: true,
            },
            isEnabled: true,
            creationDate: dateHelper.now(),
          });

      return transactionDAO
          .save({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            date: dateHelper.now(),
            account: '507f1f77bcf86cd799439010',
            isEnabled: true,
            creationDate: dateHelper.now(),
          })
          .then(function() {
            expect(createStub.callCount).to.be.equals(1);
            sinon.restore();
            nowStub.restore();
          });
    });
  });

  describe('getAll', function() {
    it('Should return a transaction which correspond to a query', function() {
      nowStub
          .returns(new Date(1546665448557));

      const findStub = sinon.mock(transactionModel).expects('find')
          .withArgs({ userId: '5bbead798c2a8a92339e88b8' })
          .chain('exec')
          .resolves([
            {
              _id: '507f1f77bcf86cd799439012',
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              date: dateHelper.now(),
              account: {
                _id: '507f1f77bcf86cd799439010',
                name: 'Card 1',
                type: 'credit',
              },
              userId: '5bbead798c2a8a92339e88b8',
              isEnabled: true,
              creationDate: dateHelper.now(),
            },
            {
              _id: '507f1f77bcf86cd799439012',
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              date: new Date(),
              account: {
                _id: '507f1f77bcf86cd799439010',
                name: 'Card 1',
                type: 'credit',
              },
              userId: '5bbead798c2a8a92339e88b8',
              isEnabled: true,
              creationDate: dateHelper.now(),
            },
          ]);

      return transactionDAO.getAll({ userId: '5bbead798c2a8a92339e88b8' })
          .then(function() {
            expect(findStub.callCount).to.be.equals(1);
            sinon.restore();
          });
    });
  });

  describe('balances', function() {
    it('Should return a empty array when userId does not have accounts',
        function() {
          const aggregateStub = sinon
              .mock(transactionModel)
              .expects('aggregate')
              .withArgs([
                { $match: { userId: '4b9872580c3ed488505ffa68' } },
                { $group: { _id: '$account', balance: { $sum: '$value' } } },
                { $lookup: {
                  from: 'accounts',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'account',
                },
                },
              ])
              .resolves([]);

          return transactionDAO.balances({ userId: '4b9872580c3ed488505ffa68' })
              .then(function(accounts) {
                expect(accounts).to.be.eqls([]);
                expect(aggregateStub.callCount).to.be.equals(1);
                sinon.restore();
              });
        });

    it('Should return a account when userId have accounts', function() {
      const aggregateStub = sinon.mock(transactionModel).expects('aggregate')
          .withArgs([
            { $match: { userId: '7b9872580c3ed488505ffa68' } },
            { $group: { _id: '$account', balance: { $sum: '$value' } } },
            { $lookup: {
              from: 'accounts',
              localField: '_id',
              foreignField: '_id',
              as: 'account',
            },
            },
          ])
          .chain('exec')
          .resolves([
            { _id: '5c216945b7a96c6cf78f5df6', balance: -99 },
            { _id: '5c1dd2322aa198732f07ad65', balance: -500 },
          ]);

      return transactionDAO.balances({ userId: '7b9872580c3ed488505ffa68' })
          .then(function(accounts) {
            expect(accounts).to.be.eqls([
              { _id: '5c216945b7a96c6cf78f5df6', balance: -99 },
              { _id: '5c1dd2322aa198732f07ad65', balance: -500 },
            ]);
            expect(aggregateStub.callCount).to.be.equals(1);
            sinon.restore();
          });
    });
  });

  describe('delete', function() {
    it('Should return error because id is empty', function() {
      const updateStub = sinon.mock(transactionModel).expects('update')
          .withArgs({})
          .rejects();

      return transactionDAO.delete()
          .then()
          .catch(function() {
            expect(updateStub.callCount).to.be.equals(0);
            sinon.restore();
          });
    });

    it('Should delete a transaction when id is correct', function() {
      const updateStub = sinon.mock(transactionModel).expects('update')
          .withArgs(
              { _id: '5c088673fb2f579adcca9ed1' },
              { isEnabled: false, exclusionDate: date }
          )
          .resolves({
            _id: '5c088673fb2f579adcca9ed1',
            name: 'test',
            email: 'test@mailtest.com',
            isEnabled: false,
            creationDate: date,
            exclusionDate: date,
          });

      return transactionDAO
          .delete(
              '5c088673fb2f579adcca9ed1',
              { isEnabled: false, exclusionDate: date }
          )
          .then(function() {
            expect(updateStub.callCount).to.be.equals(1);
            sinon.restore();
          });
    });
  });

  describe('update', function() {
    it('Should return error because id is empty', function() {
      const updateStub = sinon
          .mock(transactionModel)
          .expects('findByIdAndUpdate')
          .withArgs({})
          .rejects();

      return transactionDAO.update('', {})
          .then()
          .catch(function() {
            expect(updateStub.callCount).to.be.equals(0);
            sinon.restore();
          });
    });

    it('Should return error because body is empty', function() {
      const updateStub = sinon
          .mock(transactionModel)
          .expects('findByIdAndUpdate')
          .withArgs({})
          .rejects();

      return transactionDAO.update('5c088673fb2f579adcca9ed1', {})
          .then()
          .catch(function() {
            expect(updateStub.callCount).to.be.equals(0);
            sinon.restore();
          });
    });

    it('Should return a transaction when updated', function() {
      const updateStub = sinon
          .mock(transactionModel)
          .expects('findByIdAndUpdate')
          .withArgs(
              '5c088673fb2f579adcca9ed1',
              { $set: {
                value: 10, modificationDate: dateHelper.now() },
              },
              { new: true }
          )
          .resolves({
            _id: '5c088673fb2f579adcca9ed1',
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(1537058928785),
            account: '507f1f77bcf86cd799439012',
            installments: 5,
            creationDate: dateHelper.now(),
            modificationDate: dateHelper.now(),
          });

      return transactionDAO
          .update(
              '5c088673fb2f579adcca9ed1',
              { value: 10, modificationDate: dateHelper.now() }
          )
          .then(function() {
            expect(updateStub.callCount).to.be.equals(1);
            sinon.restore();
          });
    });
  });
});
