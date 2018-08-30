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
        it('Should return error because value does not informed', function(){
            return transactionBO.add({description: 'Tênis', type: 'out', category: 'Vestuário', date: new Date(), formPayment: 'Débito'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field Value');
                });
        });
        it('Should return error because Description does not informed', function(){
            return transactionBO.add({value: 33.9, type: 'out', category: 'Vestuário', date: new Date(), formPayment: 'Débito'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field Description');
                });
        });
        it('Should return error because out does not informed', function(){
            return transactionBO.add({description: 'Tênis', value: 33.9, category: 'Vestuário', date: new Date(), formPayment: 'Débito'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field Out');
                });
        });
    });

    //{description: 'Tênis', value: 99.0, type: 'out', category: 'Vestuário', date: new Date(), formPayment: 'Débito'}
    describe('getAll', function(){
        it('Should return zero transactions if userId does not exists', function(){
            return transactionBO.getAll({userId: 22})
                .then()
                .catch(function(){

                });
        });
    });
});
