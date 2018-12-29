var mongoose = require('mongoose');
var request  = require('supertest');
var chai     = require('chai');
var expect   = chai.expect;

describe('formPayment', function(){
    var server;
    var validToken;

    before(function(){
        server = require('../../src/server');
    });

    after(function(){
        server.close();
    });

    describe('v1/formpayment', function() {

        describe('post', function(){
            it('Should return error because request not contain token auth', function(){
                return request(server)
                    .post('/v1/formspayment')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
                    .expect(403);
            });

            it('Should return error because request contain a token invalid', function(){
                return request(server)
                    .post('/v1/formspayment')
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
                    .post('/v1/formspayment')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({})
                    .expect(422);
            });

            it('Should return error because Name does not exist', function(){
                return request(server)
                    .post('/v1/formspayment')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({type: 'creditCard'})
                    .expect(422);
            });

            it('Should return error because Type does not exist', function(){
                return request(server)
                    .post('/v1/formspayment')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1'})
                    .expect(422);
            });

            it('Should return a form of payment when inserting with success', function(){
                return request(server)
                    .post('/v1/formspayment')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
                    .expect(201)
                    .then(function(formPayment){
                        expect(formPayment.body).has.to.property('id');
                        expect(formPayment.body.name).to.be.equals('Card 1');
                        expect(formPayment.body.type).to.be.equals('creditCard');
                    });
            });
        });

        describe('get', function(){
            it('Should return error because request not contain token auth', function(){
                return request(server)
                    .get('/v1/formspayment')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
                    .expect(403);
            });

            it('Should return error because request contain a token invalid', function(){
                return request(server)
                    .get('/v1/formspayment')
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

            it('Should return a form of payment when inserting with success', function(){
                return request(server)
                    .post('/v1/formspayment')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + validToken)
                    .expect('Content-Type', /json/)
                    .send({name: 'Card 1', type: 'creditCard'})
                    .expect(201);
            });
            
            it('Should return formsPayment', function(){
                return request(server)
                    .get('/v1/formspayment')
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

    describe('v1/formspayment/balances', function() {
        it('Should return error because request not contain token auth', function(){
            return request(server)
                .get('/v1/formspayment/balances')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403);
        });

        it('Should return error because request contain a token invalid', function(){
            return request(server)
                .get('/v1/formspayment/balances')
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

        it('Should return balances array', function(){
            return request(server)
                .get('/v1/formspayment/balances')
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
