var chai = require('chai');
var expect = chai.expect;
var TransactionBO = require('../../../src/business/transactionBO');
var DAOFactory = require('../../../src/factories/factoryDAO');

describe('TransactionBO', function(){

    var transactionsDAO = DAOFactory.getDAO('transactions');

    var transactionBO = new TransactionBO({
        transactionsDAO: transactionsDAO
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
