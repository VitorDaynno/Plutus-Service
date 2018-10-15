var mongoose = require('mongoose');
var request  = require('supertest');
var chai     = require('chai');
var expect   = chai.expect;

describe('transactions', function(){
  var server;

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
              .send({value: 33.9, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
              .expect(422);
  });
    it('Should return error because body is empty', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
    });
    it('Should return error because Description does not exist', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({value: 33.9, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .expect(422);
    });
    it('Should return error because Value does not exist', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({description: 'Tênis', category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .expect(422);
    });
    it('Should return error because Category does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: 33.9, date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
              .expect(422);
    });
    it('Should return error because Date does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: 99.0, category: 'Vestuário', formPayment: '507f1f77bcf86cd799439011'})
              .expect(422);
    });
    it('Should return error because FormPayment does not exist', function(){
      return request(server)
              .post('/v1/transactions')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({description: 'Tênis', value: 99.0, category: 'Vestuário', date: new Date()})
              .expect(422);
    });
    it('Should return error when FormPayment does not found', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({description: 'Tênis', value: 9-9.0, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439010'})
                .expect(404);
    });
    it('Should return success with valid credentials', function(){
        return request(server)
                .post('/v1/transactions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'admin@plutus.com.br', password: '1234'})
                .expect(200)
                .then(function(response){
                  expect(response.body.name).to.be.equal('admin');
                  expect(response.body.email).to.be.equal('admin@plutus.com.br');
                  expect(response.body.token).to.be.not.equal('');
                });
    });
  });
});
