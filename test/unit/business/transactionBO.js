var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var TransactionBO = require('../../../src/business/transactionBO');
var DAOFactory = require('../../../src/factories/factoryDAO');
var BusinessFactory = require('../../../src/factories/factoryBO');

describe('TransactionBO', function(){

    var transactionDAO = DAOFactory.getDAO('transaction');
    var formPayment = BusinessFactory.getBO('formPayment');

    var transactionBO = new TransactionBO({
        transactionDAO: transactionDAO,
        formPayment: formPayment
    });

    describe('add', function(){
        it('Should return error because Description does not informed', function(){
            return transactionBO.add({value: -33.9, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field description');
                });
        });
        it('Should return error because Value does not informed', function(){
            return transactionBO.add({description: 'Tênis', category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field value');
                });
        });
        it('Should return error because Category does not informed', function(){
            return transactionBO.add({description: 'Tênis', value: -33.9, purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field category');
                });
        });
        it('Should return error because PurchaseDate does not informed', function(){
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field purchaseDate');
                });
        });
        it('Should return error because FormPayment does not informed', function(){
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date()})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field formPayment');
                });
        });
        it('Should return error because FormPayment are not found', function(){
            var getByIdStub = sinon.stub(formPayment, 'getById');
            getByIdStub
                .withArgs('507f1f77bcf86cd799439010')
                .returns({});

            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439010'})
                .then()
                .catch(function(error){
                    expect(getByIdStub.callCount).to.be.equals(1);
                    expect(error.code).to.be.equals(404);
                    expect(error.message).to.be.equals('The formPayment not found');
                    getByIdStub.restore();
                });
        });
        it('Should add a transactions', function(){
            var getByIdStub = sinon.stub(formPayment, 'getById');
            getByIdStub
                .withArgs('507f1f77bcf86cd799439011')
                .returns({id:'507f1f77bcf86cd799439011', name: 'Débito', type: 'debitCard'});

            var saveStub = sinon.stub(transactionDAO, 'save');
            saveStub
                .withArgs({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .returns({id: 1, description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'});
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then(function(transaction){
                    expect(getByIdStub.callCount).to.be.equals(1);
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(transaction.id).to.equals(1);
                    expect(transaction.description).to.equals('Tênis');
                    expect(transaction.value).to.equals(-99.0);
                    expect(transaction.category).to.equals('Vestuário');
                    expect(transaction.purchaseDate).to.equals(new Date());
                    expect(transaction.formPayment).to.equals('507f1f77bcf86cd799439011');
                });
        });
        var id = null;
        it('Should add a transactions with the number of installments greater than zero', function(){
        return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011', installments: 5})
                .then(function(transaction){
                    id = transaction.id;
                    expect(transaction.description).to.equals('Tênis');
                    expect(transaction.value).to.equals(-99.0);
                    expect(transaction.category).to.equals('Vestuário');
                    expect(transaction.purchaseDate).to.equals(new Date());
                    expect(transaction.formPayment).to.equals('507f1f77bcf86cd799439011');
                    expect(transaction.installments.length()).to.equals(5);
                });
        });
        it('Should return 5 transactions', function(){
            return transactionBO.getAll({id: id})
                    .then(function(transactions){
                        expect(transactions.length()).to.equals(5);
                    });
            });
    });

    describe('getAll', function(){
        it('Should return zero transactions if userId does not exists', function(){
            return transactionBO.getAll({userId: 22})
                .then()
                .catch(function(){

                });
        });
    });
});
