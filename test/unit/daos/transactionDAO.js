var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var TransactionDAO = require('../../../src/daos/transactionDAO');
var transactionModel = require('../../../src/models/transaction')();
require('sinon-mongoose');

describe('transactionDAO', function(){

    var transactionDAO = new TransactionDAO({
        transaction: transactionModel
    });

    describe('save', function(){
        it('Should return a transaction when a document transaction contain all fields', function(){
            var createStub = sinon.mock(transactionModel).expects('create')
                .withArgs({description: 'Tênis', value: -99.0, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439010'})
                .resolves({_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439010'});

            return transactionDAO.save({description: 'Tênis', value: -99.0, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439010'})
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
                            category: 'Vestuário', date: new Date(),formPayment: '507f1f77bcf86cd799439010',
                            userId:'5bbead798c2a8a92339e88b8'},
                           {_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0,
                            category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439010',
                            userId: '5bbead798c2a8a92339e88b8'}]);

            return transactionDAO.getAll({userId: '5bbead798c2a8a92339e88b8'})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
