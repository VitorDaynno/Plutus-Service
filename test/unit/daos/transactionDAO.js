var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var TransactionDAO = require('../../../src/daos/transactionDAO');
var transactionModel = require('../../../src/models/transaction')();
var sinonMongoose = require('sinon-mongoose');

describe('transactionDAO', function(){

    var transactionDAO = new TransactionDAO({
        transaction: transactionModel
    });

    describe('save', function(){
        it('Should return a transaction when a document transaction contain all fields', function(){
            var createStub = sinon.mock(transactionModel).expects('create')
                .withArgs({description: 'Tênis', value: -99.0, category: ['Vestuário'], date: new Date(), formPayment: '507f1f77bcf86cd799439010', isEnabled: true})
                .resolves({_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0,
                            category: ['Vestuário'], date: new Date(), formPayment: {_id: '507f1f77bcf86cd799439010', name: 'Card 1', type: 'creditCard', isEnabled: true}});

            return transactionDAO.save({description: 'Tênis', value: -99.0, category: ['Vestuário'], date: new Date(), formPayment: '507f1f77bcf86cd799439010', isEnabled: true})
                .then(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return a transaction which correspond to a query', function(){
            var findStub = sinon.mock(transactionModel).expects('find')
                .withArgs({userId: '5bbead798c2a8a92339e88b8'})
                .chain('exec')
                .resolves([{_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0,
                            category: ['Vestuário'], date: new Date(),formPayment: {_id: '507f1f77bcf86cd799439010', name: 'Card 1', type: 'creditCard'},
                            userId:'5bbead798c2a8a92339e88b8', isEnabled: true},
                           {_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0,
                            category: ['Vestuário'], date: new Date(), formPayment: {_id: '507f1f77bcf86cd799439010', name: 'Card 1', type: 'creditCard'},
                            userId: '5bbead798c2a8a92339e88b8', isEnabled: true}]);

            return transactionDAO.getAll({userId: '5bbead798c2a8a92339e88b8'})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
