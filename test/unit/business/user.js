var chai = require('chai');
var expect = chai.expect;
var UserBO = require('../../src/business/userBO.js');

describe('userBO', function(){

    var userBO = new UserBO();

    describe('Auth', function(){
        it('Should return error when email dont exist', function(){
            return userBO.auth({password:'123'})
                .then()
                .catch(function (error){
                    expect(error).equals({code:422, message:'Email and password are required'});
                });
        });
        it('Should return error when password dont exist', function(){
            return userBO.auth({email:'teste@emailteste.com'})
                .then()
                .catch(function (error){
                    expect(error).equals({code:422, message:'Email and password are required'});
                });
        });
        it('Should return error when user dont exist', function(){
            return userBO.auth({email:'teste@emailteste.com', password: '123'})
                .then()
                .catch(function (error){
                    expect(error).equals({code:404, message:'Incorrect email or password'});
                });
        });
        it('Should return success with correct user', function(){
            return userBO.auth({email:'teste@emailteste.com', password: '1234'})
                .then()
                .catch(function (error){
                    expect(error).equals({name: 'teste', email: 'teste@emailteste.com', token: 'dsfsfsdfsfdsafda'});
                });
        });
    });
});
