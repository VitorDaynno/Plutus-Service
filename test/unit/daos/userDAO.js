var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var UserDAO = require('../../../src/daos/userDAO');
var userModel = require('../../../src/models/user')();
require('sinon-mongoose');

describe('userDAO', function(){

    var userDAO = new UserDAO({
        user: userModel
    });

    describe('getAll', function(){
        it('Should return empty object when email dont exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({email:'email@test.com', password:'123'})
                .chain('exec')
                .resolves({});

            return userDAO.getAll({email:'email@test.com', password:'123'})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return empty object when password dont exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({email:'test@test.com', password:'1234'})
                .chain('exec')
                .resolves({});

            return userDAO.getAll({email:'test@test.com', password:'1234'})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a user when credentials exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({email:'test@test.com', password:'123'})
                .chain('exec')
                .resolves({name: 'test', email: 'test@test.com'});

            return userDAO.getAll({email:'test@test.com', password:'123'})
                .then(function(user){
                    expect(user.name).to.be.equals('test');
                    expect(user.email).to.be.equals('test@test.com');
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getById', function(){
        it('Should return empty object when id dont exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({_id:'5bbead798c2a8a92339e88b7'})
                .chain('exec')
                .resolves({});

            return userDAO.getById('5bbead798c2a8a92339e88b7')
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a user when id exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({_id:'5bbead798c2a8a92339e88b8'})
                .chain('exec')
                .resolves({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});

            return userDAO.getById('5bbead798c2a8a92339e88b8')
                .then(function(user){
                    expect(user).to.be.eqls({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
