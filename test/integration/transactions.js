const request = require('supertest');
const chai = require('chai');
const mocha = require('mocha');


const describe = mocha.describe;
const before = mocha.beforeEach;
const after = mocha.afterEach;
const it = mocha.it;
const expect = chai.expect;

describe('transactions', function() {
  let server;
  let validToken;
  let validAccount;
  let transactionId;
  // eslint-disable-next-line
  const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs'

  before(function() {
    server = require('../../src/server');
  });

  after(function() {
    server.close();
  });

  describe('v1/transactions', function() {
    it('Should return error because request not contain token auth',
        function() {
          return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({
                value: 33.9,
                categories: 'Vestuário',
                purchaseDate: new Date(),
                account: '507f1f77bcf86cd799439011',
              })
              .expect(403);
        });
    it('Should return error because request contain a token invalid',
        function() {
          return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${invalidToken}`)
              .expect('Content-Type', /json/)
              .send({
                value: 33.9,
                categories: ['Vestuário'],
                purchaseDate: new Date(),
                account: '507f1f77bcf86cd799439011',
              })
              .expect(403);
        });

    it('Should return a valid token to continue the validates', function() {
      return request(server)
          .post('/v1/users/auth')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send({ email: 'admin@plutus.com.br', password: '1234' })
          .expect(200)
          .then(function(response) {
            validToken = response.body.token;
          });
    });

    it('Should return error because body is empty', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({})
          .expect(422);
    });
    it('Should return error because Description does not exist', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            value: -33.9,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
          })
          .expect(422);
    });
    it('Should return error because Value does not exist', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            description: 'Tênis',
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
          })
          .expect(422);
    });
    it('Should return error because Categories does not exist', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            description: 'Tênis',
            value: -33.9,
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439011',
          })
          .expect(422);
    });
    it('Should return error because PurchaseDate does not exist', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            account: '507f1f77bcf86cd799439011',
          })
          .expect(422);
    });
    it('Should return error because Account does not exist', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
          })
          .expect(422);
    });
    it('Should return error when Account does not found', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: '507f1f77bcf86cd799439010',
          })
          .expect(404);
    });
    it('Should return a account when inserting with success', function() {
      return request(server)
          .post('/v1/accounts')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({ name: 'Card 1', type: 'credit' })
          .expect(201)
          .then(function(account) {
            validAccount = { id: account.body.id };
          });
    });
    it('Should return a transaction when inserting with success', function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            description: 'Tênis',
            value: -99.0,
            categories: ['Vestuário'],
            purchaseDate: new Date(),
            account: validAccount.id,
          })
          .expect(201)
          .then(function(response) {
            const transaction = response.body;
            expect(transaction).has.to.property('id');
            expect(transaction).has.to.property('purchaseDate');
            expect(transaction.description).to.be.equals('Tênis');
            expect(transaction.value).to.be.equals(-99.0);
            expect(transaction.categories).to.be.eqls(['Vestuário']);
            expect(transaction.account.id).to.be.equals(validAccount.id);
            transactionId = transaction.id;
          });
    });
    it('Should return success when deleted a transaction', function() {
      return request(server)
          .delete('/v1/transactions/' + transactionId)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .expect(200);
    });
    it(`Should return a transaction with installments when inserting with 
    success`, function() {
      return request(server)
          .post('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({
            description: 'test with installments',
            value: -59.0,
            categories: ['test'],
            purchaseDate: new Date(),
            account: validAccount.id,
            installments: 5,
          })
          .expect(201)
          .then(function(response) {
            const transaction = response.body;
            expect(transaction).has.to.property('id');
            expect(transaction).has.to.property('purchaseDate');
            expect(transaction.description)
                .to.be.equals('test with installments');
            expect(transaction.value).to.be.equals(-59.0);
            expect(transaction.categories).to.be.eqls(['test']);
            expect(transaction.account.id).to.be.equals(validAccount.id);
            transactionId = transaction.id;
          });
    });
    it('Should return success when deleted a transaction', function() {
      return request(server)
          .delete('/v1/transactions/' + transactionId)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .expect(200);
    });
  });

  describe('v1/transactions', function() {
    it('Should return error because request not contain token auth',
        function() {
          return request(server)
              .get('/v1/transactions')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(403);
        });
    it('Should return error because request contain a token invalid',
        function() {
          return request(server)
              .get('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${invalidToken}`)
              .expect('Content-Type', /json/)
              .expect(403);
        });

    it('Should return a valid token to continue the validates', function() {
      return request(server)
          .post('/v1/users/auth')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send({ email: 'admin@plutus.com.br', password: '1234' })
          .expect(200)
          .then(function(response) {
            validToken = response.body.token;
          });
    });

    it('Should return transactions belonging to the user', function() {
      return request(server)
          .get('/v1/transactions')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(function(response) {
            const transactions = response.body;
            expect(transactions[0].account).to.be.an('object');
          });
    });

    it('Should return only credit transactions belonging to the user',
        function() {
          return request(server)
              .get('/v1/transactions?onlyCredit=1')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .expect(200)
              .then(function(response) {
                const transactions = response.body;
                transactions.forEach(function(transaction) {
                  expect(transaction.account.type).to.be.equal('credit');
                });
              });
        });
  });

  describe('v1/transactions/:id', function() {
    describe('delete', function() {
      it('Should return error because request not contain token auth',
          function() {
            return request(server)
                .delete('/v1/transactions/error')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403);
          });
      it('Should return error because request contain a token invalid',
          function() {
            return request(server)
                .delete('/v1/transactions/error')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${invalidtoken}`)
                .expect('Content-Type', /json/)
                .expect(403);
          });
      it('Should return error because id is invalid', function() {
        return request(server)
            .delete('/v1/transactions/error')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + validToken)
            .expect('Content-Type', /json/)
            .expect(422);
      });
      it('Should return a empty object because id does not exist', function() {
        return request(server)
            .delete('/v1/transactions/5bbead798c2a8a92339e88b7')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + validToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(response) {
              expect(response.body).to.be.eqls({});
            });
      });
      it('Should return a transaction with valid entity', function() {
        return request(server)
            .post('/v1/transactions')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + validToken)
            .expect('Content-Type', /json/)
            .send({
              description: 'Tênis',
              value: -99.0,
              categories: ['Vestuário'],
              purchaseDate: new Date(),
              account: validAccount.id,
            })
            .expect(201)
            .then(function(response) {
              transactionId = response.body.id;
            });
      });
      it('Should return success when deleted a transaction', function() {
        return request(server)
            .delete('/v1/transactions/' + transactionId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + validToken)
            .expect('Content-Type', /json/)
            .expect(200);
      });
    });
  });
});
