var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var TransactionBO = require('../../../src/business/transactionBO');
var DAOFactory = require('../../../src/factories/factoryDAO');
var BusinessFactory = require('../../../src/factories/factoryBO');

describe('TransactionBO', function(){

    var transactionDAO = DAOFactory.getDAO('transaction');
    var formPayment = BusinessFactory.getBO('formPayment');
    var userBO = BusinessFactory.getBO('user');

    var transactionBO = new TransactionBO({
        transactionDAO: transactionDAO,
        formPayment: formPayment,
        userBO: userBO
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
                .returns({id: 1, description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928385), formPayment: '507f1f77bcf86cd799439011'});
            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(), formPayment: '507f1f77bcf86cd799439011'})
                .then(function(transaction){
                    expect(getByIdStub.callCount).to.be.equals(1);
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(transaction).to.be.eqls({id: 1, description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928385), formPayment: '507f1f77bcf86cd799439011'});
                    getByIdStub.restore();
                    saveStub.restore();
                });
        });
        it('Should add a transactions with the number of installments greater than zero', function(){
            var getByIdStub = sinon.stub(formPayment, 'getById');
            getByIdStub
                .withArgs('507f1f77bcf86cd799439012')
                .returns({id:'507f1f77bcf86cd799439012', name: 'Crédito', type: 'creditCard'});

            var saveStub = sinon.stub(transactionDAO, 'save');
            saveStub
                .withArgs({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928785), formPayment: '507f1f77bcf86cd799439012', installments: 5})
                .returns({id: 3, description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928785), formPayment: '507f1f77bcf86cd799439012', installments: 5});

            return transactionBO.add({description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928785), formPayment: '507f1f77bcf86cd799439012', installments: 5})
                .then(function(transaction){
                    expect(transaction).to.be.eqls({id:3, description: 'Tênis', value: -99.0,
                        category: 'Vestuário', purchaseDate: new Date(1537058928785), formPayment: '507f1f77bcf86cd799439012', installments: 5});
                    expect(getByIdStub.callCount).to.be.equals(1);
                    expect(saveStub.callCount).to.be.equal(6);
                    getByIdStub.restore();
                    saveStub.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return zero transactions if userId does not exists', function(){
            var getByIdStub = sinon.stub(userBO, 'getById');
            getByIdStub
                .withArgs({userId:22})
                .returns({code: 404, message: 'User not found'});

            var getAllStub = sinon.stub(transactionDAO, 'getAll');
            getAllStub
                .withArgs({userId: 21})
                .returns([]);

            return transactionBO.getAll({userId: 22})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(404);
                    expect(error.message).to.be.equals('No transactions were found');
                    expect(getByIdStub.callCount).to.be.equals(1);
                    expect(getAllStub.callCount).to.be.equals(0);
                    getByIdStub.restore();
                    getAllStub.restore();
                });
        });
        it('Should return zero transactions by valid user', function(){
            var getByIdStub = sinon.stub(userBO, 'getById');
            getByIdStub
                .withArgs({userId:21})
                .returns({userId: 21, name: 'test', email: 'test@test.com'});

            var getAllStub = sinon.stub(transactionDAO, 'getAll');
            getAllStub
                .withArgs({userId: 21})
                .returns([]);

            return transactionBO.getAll({userId:21})
                .then(function(transactions){
                    expect(transactions.length).to.be.equal(0);
                    expect(getByIdStub.callCount).to.be.equal(1);
                    expect(getAllStub.callCount).to.be.equal(1);
                });
        });
        it('Should return a transactions by valid user', function(){
            var getByIdStub = sinon.stub(userBO, 'getById');
            getByIdStub
                .withArgs({userId:22})
                .returns({userId: 22, name: 'test', email: 'test@test.com'});

            var getAllStub = sinon.stub(transactionDAO, 'getAll');
            getAllStub
                .withArgs({userId: 22})
                .returns([{id: 3, description: 'Tênis', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928785), formPayment: '507f1f77bcf86cd799439012', installments: 5},
                          {id: 4, description: 'Tênis 2', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928785), formPayment: '507f1f77bcf86cd799439012', installments: 5},
                          {id: 5, description: 'Tênis 3', value: -99.0, category: 'Vestuário', purchaseDate: new Date(1537058928785), formPayment: '507f1f77bcf86cd799439012', installments: 5}]);

            return transactionBO.getAll({userId: 22})
                .then(function(transactions){
                    expect(transactions.length).to.be.equal(3);
                    expect(getByIdStub).to.be.equal(1);
                    expect(getAllStub).to.be.equal(1);
                });
        });
    });
});
