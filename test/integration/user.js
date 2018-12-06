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

  describe('v1/users/:id',function() {
    it('Should return error because id is invalid', function(){
        return request(server)
                .get('/v1/users/error')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
    });
    it('Should return a empty array because id does not exist', function(){
        return request(server)
                .get('/v1/users/5bbead798c2a8a92339e88b7')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function(response){
                  expect(response.body).to.be.eqls({});
                });
    });
    it('Should return user with valid id', function(){
        return request(server)
                .get('/v1/users/5b9872580c3ed488505ffa68')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function(response){
                  expect(response.body.name).to.be.equal('admin');
                  expect(response.body.email).to.be.equal('admin@plutus.com.br');
                });
    });
  });

  describe('v1/users',function() {
    it('Should return error because body is empty', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
    });
    it('Should return error because email does not exist', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({name: 'test', password:'123'})
                .expect(422);
    });
    it('Should return error because name does not exist', function(){
      return request(server)
              .post('/v1/users')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({email: 'test@emailtest.com', password:'123'})
              .expect(422);
    });
    it('Should return error because password does not exist', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'test@mailtest.com', name: 'test'})
                .expect(422);
    });
    it('Should return user with valid entity', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'test@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  expect(response.body.name).to.be.equal('test');
                  expect(response.body.email).to.be.equal('test@emailtest.com');
                  expect(response.body).to.not.have.property('password');
                });
    });
  });
});
