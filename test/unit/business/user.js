var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var UserBO = require('../../../src/business/userBO.js');
var DAOFactory = require('../../../src/factories/factoryDAO');

describe('userBO', function(){
    var userDAO = DAOFactory.getDAO('user');

    var userBO = new UserBO({
        userDAO: userDAO
    });

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
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'testes@emailteste.com', password: '1234'})
                .returns(Promise.resolve({}));

            return userBO.auth({email:'testes@emailteste.com', password: '1234'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.equals(1);
                    expect(error).equals({code:404, message:'Incorrect email or password'});
                });
        });
        it('Should return error when password is incorrect', function(){
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'teste@emailteste.com', password: '123'})
                .returns(Promise.resolve({}));

            return userBO.auth({email:'teste@emailteste.com', password: '123'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.equals(1);
                    expect(error).equals({code:404, message:'Incorrect email or password'});
                });
        });
        it('Should return success with correct user', function(){
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'teste@emailteste.com', password: '1234'})
                .returns(Promise.resolve({_id:1, name: 'teste', email: 'teste@emailteste.com'}));

            return userBO.auth({email:'teste@emailteste.com', password: '1234'})
                    .then(function(auth){
                        expect(getAllStub.callCount).to.equals(1);
                        expect(auth).equals({name: 'teste', email: 'teste@emailteste.com', token: 'dsfsfsdfsfdsafda'});
                    });
        });
    });
});
