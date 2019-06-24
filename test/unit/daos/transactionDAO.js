var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonMongoose = require('sinon-mongoose');
var TransactionDAO = require('../../../src/daos/transactionDAO');
var transactionModel = require('../../../src/models/transaction')();
var dateHelper = require('../../../src/helpers/dateHelper');

describe('transactionDAO', function(){

    var transactionDAO = new TransactionDAO({
        transaction: transactionModel
    });

    describe('save', function(){
        it('Should return a error when a document can not cast', function(){
            var nowStub = sinon.stub(dateHelper, 'now');
            nowStub
                .returns(new Date(1546665448537));

            var createStub = sinon.mock(transactionModel).expects('create')
                .withArgs('error')
                .rejects({name: 'CastError'});

            return transactionDAO.save('error')
                .catch(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                    nowStub.restore();
                });
        });
        it('Should return a error when a document contain error of validation', function(){
            var nowStub = sinon.stub(dateHelper, 'now');
            nowStub
                .returns(new Date(1546665448537));

            var createStub = sinon.mock(transactionModel).expects('create')
                .withArgs({value: -99.0, categories: ['Vestuário'], date: new Date(), account: '507f1f77bcf86cd799439010', isEnabled: true, creationDate: dateHelper.now()})
                .rejects({name: 'ValidadeError'});

            return transactionDAO.save({value: -99.0, categories: ['Vestuário'], date: new Date(), account: '507f1f77bcf86cd799439010', isEnabled: true, creationDate: dateHelper.now()})
                .catch(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                    nowStub.restore();
                });
        });
        it('Should return a transaction when a document transaction contain all fields', function(){
            var nowStub = sinon.stub(dateHelper, 'now');
            nowStub
                .returns(new Date(1546665448537));

            var createStub = sinon.mock(transactionModel).expects('create')
                .withArgs({description: 'Tênis', value: -99.0, categories: ['Vestuário'], date: new Date(), account: '507f1f77bcf86cd799439010', isEnabled: true, creationDate: dateHelper.now()})
                .resolves({_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0,
                            categories: ['Vestuário'], date: new Date(), account: {_id: '507f1f77bcf86cd799439010', name: 'Card 1', type: 'creditCard', isEnabled: true},
                            isEnabled: true, creationDate: dateHelper.now()});

            return transactionDAO.save({description: 'Tênis', value: -99.0, categories: ['Vestuário'],
                                            date: new Date(), account: '507f1f77bcf86cd799439010', isEnabled: true, creationDate: dateHelper.now()})
                .then(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                    nowStub.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return a transaction which correspond to a query', function(){
            var nowStub = sinon.stub(dateHelper, 'now');
            nowStub
                .returns(new Date(1546665448557));

            var findStub = sinon.mock(transactionModel).expects('find')
                .withArgs({userId: '5bbead798c2a8a92339e88b8'})
                .chain('exec')
                .resolves([{_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0,
                            categories: ['Vestuário'], date: new Date(), account: {_id: '507f1f77bcf86cd799439010', name: 'Card 1', type: 'creditCard'},
                            userId:'5bbead798c2a8a92339e88b8', isEnabled: true, creationDate: dateHelper.now()},
                           {_id: '507f1f77bcf86cd799439012', description: 'Tênis', value: -99.0,
                            categories: ['Vestuário'], date: new Date(), account: {_id: '507f1f77bcf86cd799439010', name: 'Card 1', type: 'creditCard'},
                            userId: '5bbead798c2a8a92339e88b8', isEnabled: true, creationDate: dateHelper.now()}]);

            return transactionDAO.getAll({userId: '5bbead798c2a8a92339e88b8'})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('balances', function(){
        it('Should return a empty array when userId does not have accounts', function(){
            var aggregateStub = sinon.mock(transactionModel).expects('aggregate')
                .withArgs([{$match: {userId: '4b9872580c3ed488505ffa68'}},
                        {$group:{_id: '$account', balance: {$sum: '$value'}}},
                        {$lookup:{from: 'accounts', localField: '_id', foreignField: '_id', as: 'account'}}
                    ])
                .resolves([]);

            return transactionDAO.balances({userId: '4b9872580c3ed488505ffa68'})
                .then(function(accounts){
                    expect(accounts).to.be.eqls([]);
                    expect(aggregateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a account when userId have accounts', function(){
            var aggregateStub = sinon.mock(transactionModel).expects('aggregate')
                .withArgs([{$match: {userId: '7b9872580c3ed488505ffa68'}},
                        {$group:{_id: '$account', balance: {$sum: '$value'}}},
                        {$lookup:{from: 'accounts', localField: '_id', foreignField: '_id', as: 'account'}}
                    ])
                .chain('exec')
                .resolves([{_id : '5c216945b7a96c6cf78f5df6', balance : -99},
                          {_id : '5c1dd2322aa198732f07ad65', balance : -500}]);

            return transactionDAO.balances({userId: '7b9872580c3ed488505ffa68'})
                .then(function(accounts){
                    expect(accounts).to.be.eqls([{_id : '5c216945b7a96c6cf78f5df6', balance : -99}, {_id : '5c1dd2322aa198732f07ad65', balance : -500}]);
                    expect(aggregateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
