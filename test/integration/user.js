var request               = require('supertest');
var chai                  = require('chai');
var expect                = chai.expect;

describe('users', function(){
  var server;

  before(function(){
    server = require('../../../src/server');
  });

  after(function(){
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
                .send({email:'teste@emailteste.com'})
                .expect(422);
    });
    it('Should return error with incorrect password', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'teste@emailteste.com', password: '123'})
                .expect(403);
    });
    it('Should return success with valid credentials', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'teste@emailteste.com', password: '1234'})
                .expect(200)
                .then(function(response){
                    expect(response).contains(token);
                });
    });
  });
});
