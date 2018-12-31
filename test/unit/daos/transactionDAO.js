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

    describe('balances', function(){
        it('Should return a empty array when userId does not have formsPayments', function(){
            var aggregateStub = sinon.mock(transactionModel).expects('aggregate')
                .withArgs([{$match: {userId: '4b9872580c3ed488505ffa68'}},
                        {$group:{_id: '$formPayment', balance: {$sum: '$value'}}},
                        {$lookup:{from: 'formpayments', localField: '_id', foreignField: '_id', as: 'formPayment'}}
                    ])
                .resolves([]);

            return transactionDAO.balances({userId: '4b9872580c3ed488505ffa68'})
                .then(function(formsPayment){
                    expect(formsPayment).to.be.eqls([]);
                    expect(aggregateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a form of payment when userId have formsPayments', function(){
            var aggregateStub = sinon.mock(transactionModel).expects('aggregate')
                .withArgs([{$match: {userId: '7b9872580c3ed488505ffa68'}},
                        {$group:{_id: '$formPayment', balance: {$sum: '$value'}}},
                        {$lookup:{from: 'formpayments', localField: '_id', foreignField: '_id', as: 'formPayment'}}
                    ])
                .chain('exec')
                .resolves([{_id : '5c216945b7a96c6cf78f5df6', balance : -99},
                          {_id : '5c1dd2322aa198732f07ad65', balance : -500}]);

            return transactionDAO.balances({userId: '7b9872580c3ed488505ffa68'})
                .then(function(formsPayment){
                    expect(formsPayment).to.be.eqls([{_id : '5c216945b7a96c6cf78f5df6', balance : -99}, {_id : '5c1dd2322aa198732f07ad65', balance : -500}]);
                    expect(aggregateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
