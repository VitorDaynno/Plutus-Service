var mongoose = require('mongoose');
var request  = require('supertest');
var chai     = require('chai');
var expect   = chai.expect;

describe('users', function(){
  var server;

  before(function(){
    server = require('../../src/server');
  });

  after(function(){
    mongoose.connection.close();
    server.close();
  });

  describe('v1/users/auth',function() {
    it('Should return error because body is empty', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
    });
    it('Should return error because email does not exist', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({password:'123'})
                .expect(422);
    });
    it('Should return error because password does not exist', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'test@mailtest.com'})
                .expect(422);
    });
    it('Should return error with incorrect password', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'test@mailtest.com', password: '123'})
                .expect(401);
    });
    it('Should return success with valid credentials', function(){
        return request(server)
                .post('/v1/users/auth')
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
