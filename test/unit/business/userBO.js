var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var UserBO = require('../../../src/business/userBO.js');
var DAOFactory = require('../../../src/factories/factoryDAO');
var JWTHelper = require('../../../src/helpers/jwtHelper');
var ModelHelper = require('../../../src/helpers/modelHelper');
var CryptoHelper = require('../../../src/helpers/cryptoHelper');

describe('userBO', function(){
    var userDAO = DAOFactory.getDAO('user');
    var jwtHelper = new JWTHelper();

    var userBO = new UserBO({
        userDAO: userDAO,
        jwtHelper: jwtHelper,
        modelHelper: ModelHelper,
        cryptoHelper: CryptoHelper
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
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('1234')
                .returns('59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb');

            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'tests@mailtest.com', password: '59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb'})
                .returns(Promise.resolve({}));

            return userBO.auth({email:'tests@mailtest.com', password: '1234'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.be.equals(1);
                    expect(encryptStub.callCount).to.be.equals(1);
                    expect(error.code).to.be.equals(401);
                    expect(error.message).to.be.equals('Email or password are incorrect');
                    getAllStub.restore();
                    encryptStub.restore();
                });
        });
        it('Should return error when password is incorrect', function(){
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('123')
                .returns('efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19');

            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19'})
                .returns(Promise.resolve({}));

            return userBO.auth({email: 'test@mailtest.com', password: '123'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.be.equals(1);
                    expect(encryptStub.callCount).to.be.equals(1);
                    expect(error.code).to.be.equals(401);
                    expect(error.message).to.be.equals('Email or password are incorrect');
                    getAllStub.restore();
                    encryptStub.restore();
                });
        });
        it('Should return success with correct user', function(){
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('1234')
                .returns('59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb');

            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', password: '59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb'})
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
                        expect(encryptStub.callCount).to.be.equals(1);
                        expect(getAllStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(1);
                        expect(createTokenStub.callCount).to.be.equals(1);
                        expect(auth.name).to.be.equals('test');
                        expect(auth.email).to.be.equals('test@mailtest.com');
                        expect(auth.token).to.be.equals('token-jwt');
                        encryptStub.restore();
                        getAllStub.restore();
                        parseUserStub.restore();
                        createTokenStub.restore();
                    });
        });
    });

    describe('save', function(){
        it('Should return error when body does not exist', function(){
            var saveStub = sinon.stub(userDAO, 'save');

            return userBO.save()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Email are required');
                        expect(saveStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                    });
        });
    });

    describe('getById', function(){
        it('should return error when body does not exist', function() {
            var getByIdStub = sinon.stub(userDAO, 'getById');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.getById()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(getByIdStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('should return error when body does not contains the field id', function() {
            var getByIdStub = sinon.stub(userDAO, 'getById');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.getById({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('should return error when id does not exist', function() {
            var getByIdStub = sinon.stub(userDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b7')
                .returns({});
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.getById({id: '5bbead798c2a8a92339e88b7'})
                    .then(function(user){
                        expect(user).to.be.eqls({});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('should return a user when userId belongs to some user', function() {
            var getByIdStub = sinon.stub(userDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b8')
                .returns({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'})
                .returns({id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});

            return userBO.getById({id: '5bbead798c2a8a92339e88b8'})
                    .then(function(user){
                        expect(user).to.be.eqls({id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(1);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
    });
});
