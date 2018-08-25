var chai = require('chai');
var expect = chai.expect;
var TransactionBO = require('../../../src/business/transactionBO');

describe('TransactionBO', function(){

    var transactionBO = new TransactionBO();

    describe('', function(){
        it('getAll', function(){
            return transactionBO.getAll()
                .then(function(){

                });
        });
    });
});
