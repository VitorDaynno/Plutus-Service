var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var AccountDAO = require('../../../src/daos/accountDAO');
var accountModel = require('../../../src/models/account')();
require('sinon-mongoose');

describe('accountDAO', function(){

    var accountDAO = new AccountDAO({
        account: accountModel
    });

    describe('save', function(){
        it('Should return a account when a document transaction contain all fields', function(){
            var createStub = sinon.mock(accountModel).expects('create')
                .withArgs({name: 'Card 1', type: 'credit', userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568033243)})
                .resolves({_id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'credit', isEnabled: true, creationDate: Date(1546568033243)});

            return accountDAO.save({name: 'Card 1', type: 'credit', userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568033243)})
                .then(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getById', function(){
        it('Should return empty object when id dont exist', function(){
            var findByStub = sinon.mock(accountModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b7')
                .chain('exec')
                .resolves({});

            return accountDAO.getById('5bbead798c2a8a92339e88b7')
                .then(function(){
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a account when id exist', function(){
            var findByStub = sinon.mock(accountModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b8')
                .chain('exec')
                .resolves({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'credit', isEnabled: true, creationDate: Date(1546568233243)});

            return accountDAO.getById('5bbead798c2a8a92339e88b8')
                .then(function(account){
                    expect(account).to.be.eqls({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'credit', isEnabled: true, creationDate: Date(1546568233243)});
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return a empty array when userId does not have accounts', function(){
            var findStub = sinon.mock(accountModel).expects('find')
                .withArgs({userId: '5bbead798c2a8a92339e88b4'})
                .chain('exec')
                .resolves([]);

            return accountDAO.getAll({userId: '5bbead798c2a8a92339e88b4'})
                .then(function(accounts){
                    expect(accounts).to.be.eqls([]);
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a account when userId have accounts', function(){
            var findStub = sinon.mock(accountModel).expects('find')
                .withArgs({userId: '5bbead798c2a8a92339e88b3'})
                .chain('exec')
                .resolves({_id: '5bbead798c2a8a92339e88b2', name: 'Card 1', type: 'credit', userId: '5bbead798c2a8a92339e88b3' ,isEnabled: true, creationDate: Date(1546568033253)});

            return accountDAO.getAll({userId: '5bbead798c2a8a92339e88b3'})
                .then(function(account){
                    expect(account).to.be.eqls({_id: '5bbead798c2a8a92339e88b2', name: 'Card 1', type: 'credit', userId: '5bbead798c2a8a92339e88b3' ,isEnabled: true, creationDate: Date(1546568033253)});
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
