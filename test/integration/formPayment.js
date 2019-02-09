var request  = require('supertest');
var chai     = require('chai');
var expect   = chai.expect;

describe('account', function(){
    var server;
    var validToken;
    var accountId;

    before(function(){
        server = require('../../src/server');
    });

    after(function(){
        server.close();
    });

    describe('v1/account', function() {

        describe('post', function(){
            it('Should return error because request not contain token auth', function(){
                return request(server)
                    .post('/v1/accounts')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
                    .expect(403);
            });

            it('Should return error because request contain a token invalid', function(){
                return request(server)
                    .post('/v1/accounts')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
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
                    .post('/v1/accounts')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({})
                    .expect(422);
            });

            it('Should return error because Name does not exist', function(){
                return request(server)
                    .post('/v1/accounts')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({type: 'creditCard'})
                    .expect(422);
            });

            it('Should return error because Type does not exist', function(){
                return request(server)
                    .post('/v1/accounts')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1'})
                    .expect(422);
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
                        expect(account.body).has.to.property('id');
                        expect(account.body.name).to.be.equals('Card 1');
                        expect(account.body.type).to.be.equals('creditCard');
                    });
            });
        });

        describe('get', function(){
            it('Should return error because request not contain token auth', function(){
                return request(server)
                    .get('/v1/accounts')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
                    .expect(403);
            });

            it('Should return error because request contain a token invalid', function(){
                return request(server)
                    .get('/v1/accounts')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
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

            it('Should return a account when inserting with success', function(){
                return request(server)
                    .post('/v1/accounts')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
                    .expect(201);
            });

            it('Should return accounts', function(){
                return request(server)
                    .get('/v1/accounts')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(function(response){
                        expect(response.body.length).to.gt(0);
                    });
            });

        });
    });

    describe('v1/accounts/balances', function() {
        it('Should return error because request not contain token auth', function(){
            return request(server)
                .get('/v1/accounts/balances')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403);
        });

        it('Should return error because request contain a token invalid', function(){
            return request(server)
                .get('/v1/accounts/balances')
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

        it('Should return a account when inserting with success', function(){
            return request(server)
                .post('/v1/accounts')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({name: 'Card 1', type: 'creditCard'})
                .expect(201)
                .then(function(response){
                    accountId = response.body.id;
                });
        });

        it('Should return a transaction when inserting with success', function(){
            return request(server)
                    .post('/v1/transactions')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({description: 'test', value: -99.0, categories: ['test'], purchaseDate: new Date(), account: accountId})
                    .expect(201);
          });

        it('Should return balances array', function(){
            return request(server)
                .get('/v1/accounts/balances')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function(response){
                    expect(response.body.length).to.be.gt(0);
                });
        });
    });
});
