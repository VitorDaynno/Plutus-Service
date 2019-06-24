var request  = require('supertest');
var chai     = require('chai');
var expect   = chai.expect;

describe('transactions', function(){
  var server;
  var validToken;
  var validAccountId;

  before(function(){
    server = require('../../src/server');
  });

  after(function(){
    server.close();
  });

  describe('v1/transactions',function() {
    it('Should return error because request not contain token auth', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({value: 33.9, categories: 'Vestuário', purchaseDate: new Date(), account: '507f1f77bcf86cd799439011'})
              .expect(403);
    });
    it('Should return error because request contain a token invalid', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .send({value: 33.9, categories: ['Vestuário'], purchaseDate: new Date(), account: '507f1f77bcf86cd799439011'})
              .expect(403);
    });

    it('Should return a valid token to continue the validates', function(){
      return request(server)
              .post('/v1/users/auth')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({email:'admin@plutus.com.br', password: '1234'})
              .expect(200)
              .then(function(response){
                validToken = response.body.token;
              });
    });

    it('Should return error because body is empty', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
    });
    it('Should return error because Description does not exist', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({value: -33.9, categories: ['Vestuário'], purchaseDate: new Date(), account: '507f1f77bcf86cd799439011'})
                .expect(422);
    });
    it('Should return error because Value does not exist', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({description: 'Tênis', categories: ['Vestuário'], purchaseDate: new Date(), account: '507f1f77bcf86cd799439011'})
                .expect(422);
    });
    it('Should return error because Categories does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -33.9, purchaseDate: new Date(), account: '507f1f77bcf86cd799439011'})
              .expect(422);
    });
    it('Should return error because PurchaseDate does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -99.0, categories: ['Vestuário'], account: '507f1f77bcf86cd799439011'})
              .expect(422);
    });
    it('Should return error because Account does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -99.0, categories: ['Vestuário'], purchaseDate: new Date()})
              .expect(422);
    });
    it('Should return error when Account does not found', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({description: 'Tênis', value: -99.0, categories: ['Vestuário'], purchaseDate: new Date(), account: '507f1f77bcf86cd799439010'})
                .expect(404);
    });
    it('Should return a account when inserting with success', function(){
      return request(server)
          .post('/v1/accounts')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + validToken)
          .expect('Content-Type', /json/)
          .send({name: 'Card 1', type: 'creditCard'})
          .expect(201)
          .then(function(account){
              validAccountId = account.body.id;
          });
    });
    it('Should return a transaction when inserting with success', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -99.0, categories: ['Vestuário'], purchaseDate: new Date(), account: validAccountId})
              .expect(201)
              .then(function(response){
                var transaction = response.body;
                expect(transaction).has.to.property('id');
                expect(transaction).has.to.property('purchaseDate');
                expect(transaction.description).to.be.equals('Tênis');
                expect(transaction.value).to.be.equals(-99.0);
                expect(transaction.categories).to.be.eqls(['Vestuário']);
                expect(transaction.account).to.be.equals(validAccountId);
              });
    });
    it('Should return a transaction with installments when inserting with success', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'test with installments', value: -59.0, categories: ['test'], purchaseDate: new Date(), account: validAccountId, installments: 5})
              .expect(201)
              .then(function(response){
                var transaction = response.body;
                expect(transaction).has.to.property('id');
                expect(transaction).has.to.property('purchaseDate');
                expect(transaction.description).to.be.equals('test with installments');
                expect(transaction.value).to.be.equals(-59.0);
                expect(transaction.categories).to.be.eqls(['test']);
                expect(transaction.account).to.be.equals(validAccountId);
              });
    });
    it('Should return transactions belonging to the user', function(){
      return request(server)
              .get('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .expect(200)
              .then(function(response){
                var transactions = response.body;
                expect(transactions.length).to.be.equal(6);
              });
    });
  });

  describe('v1/transactions',function() {
    it('Should return error because request not contain token auth', function(){
      return request(server)
              .get('/v1/transactions')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(403);
    });
    it('Should return error because request contain a token invalid', function(){
      return request(server)
              .get('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .expect(403);
    });

    it('Should return a valid token to continue the validates', function(){
      return request(server)
              .post('/v1/users/auth')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({email:'admin@plutus.com.br', password: '1234'})
              .expect(200)
              .then(function(response){
                validToken = response.body.token;
              });
    });

    it('Should return transactions belonging to the user', function(){
        return request(server)
                .get('/v1/transactions')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function(response){
                  var transactions = response.body;
                  expect(transactions[0].account).to.be.an('object');
                });
    });

  });
});
