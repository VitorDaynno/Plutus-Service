var chai = require('chai');
var expect = chai.expect;
var TransactionBO = require('../../../src/business/transactionBO');
var DAOFactory = require('../../../src/factories/factoryDAO');

describe('TransactionBO', function(){

    var transactionsDAO = DAOFactory.getDAO('transactions');

    var transactionBO = new TransactionBO({
        transactionsDAO: transactionsDAO
    });

    describe('add', function(){
        it('Should return error because Description does not informed', function(){
            return transactionBO.add({value: -33.9, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field description');
                });
        });
        it('Should return error because Value does not informed', function(){
            return transactionBO.add({description: 'Tênis', category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field value');
                });
        });
        it('Should return error because Category does not informed', function(){
            return transactionBO.add({description: 'Tênis', value: -33.9, date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field category');
                });
        });
        it('Should return error because Date does not informed', function(){
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', formPayment: '507f1f77bcf86cd799439011'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field date');
                });
        });
        it('Should return error because FormPayment does not informed', function(){
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', date: new Date()})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field formPayment');
                });
        });
        it('Should return error because FormPayment are not found', function(){
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439010'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(404);
                    expect(error.message).to.be.equals('The formPayment not found');
                });
        });
        it('Should add a transactions', function(){
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', date: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then(function(transaction){
                    expect(transaction.description).to.equals('Tênis');
                    expect(transaction.value).to.equals(-99.0);
                    expect(transaction.category).to.equals('Vestuário');
                    expect(transaction.date).to.equals(new Date());
                    expect(transaction.formPayment).to.equals('507f1f77bcf86cd799439011');
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
