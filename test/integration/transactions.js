var mongoose = require('mongoose');
var request  = require('supertest');
var chai     = require('chai');

describe('transactions', function(){
  var server;
  var validToken;

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
              .send({value: 33.9, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
              .expect(403);
    });
    it('Should return error because request contain a token invalid', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .send({value: 33.9, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
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
                .send({value: -33.9, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .expect(422);
    });
    it('Should return error because Value does not exist', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({description: 'Tênis', category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .expect(422);
    });
    it('Should return error because Category does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -33.9, purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
              .expect(422);
    });
    it('Should return error because PurchaseDate does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -99.0, category: 'Vestuário', formPayment: '507f1f77bcf86cd799439011'})
              .expect(422);
    });
    it('Should return error because FormPayment does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date()})
              .expect(422);
    });
    it('Should return error when FormPayment does not found', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439010'})
                .expect(404);
    });
    it('Should return a transaction when inserting with success', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: -99.0, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
              .expect(201)
              .then(function(transaction){
                expect(transaction).to.be.equls({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'});
              });
    });
  });
});
