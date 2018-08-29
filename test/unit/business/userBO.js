var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var UserBO = require('../../../src/business/userBO.js');
var DAOFactory = require('../../../src/factories/factoryDAO');
var JWTHelper = require('../../../src/helpers/jwtHelper');
var ModelHelper = require('../../../src/helpers/modelHelper');

describe('userBO', function(){
    var userDAO = DAOFactory.getDAO('user');
    var jwtHelper = new JWTHelper();

    var userBO = new UserBO({
        userDAO: userDAO,
        jwtHelper: jwtHelper,
        modelHelper: ModelHelper
    });

    describe('Auth', function(){
        it('Should return error when email dont exist', function(){
            return userBO.auth({password:'123'})
                .then()
                .catch(function (error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Email and password are required');
                });
        });
        it('Should return error when password dont exist', function(){
            return userBO.auth({email:'test@mailtest.com'})
                .then()
                .catch(function (error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Email and password are required');
                });
        });
        it('Should return error when user dont exist', function(){
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'tests@mailtest.com', password: '1234'})
                .returns(Promise.resolve({}));

            return userBO.auth({email:'tests@mailtest.com', password: '1234'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.be.equals(1);
                    expect(error.code).to.be.equals(401);
                    expect(error.message).to.be.equals('Email or password are incorrect');
                    getAllStub.restore();
                });
        });
        it('Should return error when password is incorrect', function(){
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', password: '123'})
                .returns(Promise.resolve({}));

            return userBO.auth({email: 'test@mailtest.com', password: '123'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.be.equals(1);
                    expect(error.code).to.be.equals(401);
                    expect(error.message).to.be.equals('Email or password are incorrect');
                    getAllStub.restore();
                });
        });
        it('Should return success with correct user', function(){
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', password: '1234'})
                .returns([{_id: 1, name: 'test', email: 'test@mailtest.com'}]);

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: 1, name: 'test', email: 'test@mailtest.com'})
                .returns({id: 1, name: 'test', email: 'test@mailtest.com'});

            var createTokenStub = sinon.stub(jwtHelper, 'createToken');
            createTokenStub
                .withArgs({id: 1, name: 'test', email: 'test@mailtest.com'})
                .returns('token-jwt');

            return userBO.auth({email:'test@mailtest.com', password: '1234'})
                    .then(function(auth){
                        console.log(auth)
                        expect(getAllStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(1);
                        expect(createTokenStub.callCount).to.be.equals(1);
                        expect(auth.name).to.be.equals('test');
                        expect(auth.email).to.be.equals('test@mailtest.com');
                        expect(auth.token).to.be.equals('token-jwt');
                    });
        });
    });
});
