var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var FormPaymentBO = require('../../../src/business/formPaymentBO');
var DAOFactory = require('../../../src/factories/factoryDAO');
var ModelHelper = require('../../../src/helpers/modelHelper');
var DateHelper = require('../../../src/helpers/dateHelper');

describe('FormPaymentBO', function(){

    var formPaymentDAO = DAOFactory.getDAO('formPayment');
    var transactionDAO = DAOFactory.getDAO('transaction');

    var formPaymentBO = new FormPaymentBO({
        formPaymentDAO: formPaymentDAO,
        transactionDAO: transactionDAO,
        modelHelper: ModelHelper,
        dateHelper: DateHelper
    });

    describe('add', function(){
        it('Should return error because Name does not informed', function(){
            return formPaymentBO.add({type: 'creditCard', userId: '9bddd5a80a2cad1e079a334c'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field name');
                });
        });
        it('Should return error because Type does not informed', function(){
            return formPaymentBO.add({name: 'Card 1', userId: '9bddd5a80a2cad1e079a334c'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field type');
                });
        });
        it('Should add a transactions', function(){
            var nowStub = sinon.stub(DateHelper, 'now');
            nowStub
                .returns(new Date(1546655261010));

            var saveStub = sinon.stub(formPaymentDAO, 'save');
            saveStub
                .withArgs({name: 'Card 1', type: 'creditCard', userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: DateHelper.now()})
                .returns({_id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c',isEnabled: true, creationDate: DateHelper.now()});

            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');
            parseFormPaymentStub
                .withArgs({_id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: DateHelper.now()})
                .returns({id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'creditCard'});

            return formPaymentBO.add({name: 'Card 1', type: 'creditCard', userId: '9bddd5a80a2cad1e079a334c'})
                .then(function(transaction){
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseFormPaymentStub.callCount).to.be.equals(1);
                    expect(transaction).to.be.eqls({id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'creditCard'});
                    nowStub.restore();
                    saveStub.restore();
                    parseFormPaymentStub.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return error because body does not exist', function(){
            var getAllStub = sinon.stub(formPaymentDAO, 'getAll');
            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');

            return formPaymentBO.getAll()
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equal(422);
                    expect(error.message).to.be.equal('UserId are required');
                    expect(getAllStub.callCount).to.be.equal(0);
                    expect(parseFormPaymentStub.callCount).to.be.equal(0);
                    getAllStub.restore();
                    parseFormPaymentStub.restore();
                });
        });

        it('Should return error because field userId does not exist', function(){
            var getAllStub = sinon.stub(formPaymentDAO, 'getAll');
            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');

            return formPaymentBO.getAll({})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equal(422);
                    expect(error.message).to.be.equal('UserId are required');
                    expect(getAllStub.callCount).to.be.equal(0);
                    expect(parseFormPaymentStub.callCount).to.be.equal(0);
                    getAllStub.restore();
                    parseFormPaymentStub.restore();
                });
        });

        it('Should return a empty array because userId does not have formsPayment', function(){
            var getAllStub = sinon.stub(formPaymentDAO, 'getAll');
            getAllStub
                .withArgs({userId: '5bddd5a80a8cad1e079a334c'})
                .returns([]);

            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');
            parseFormPaymentStub
                .withArgs([])
                .returns([]);

            return formPaymentBO.getAll({userId: '5bddd5a80a8cad1e079a334c'})
                .then(function(formPayments){
                    expect(formPayments).to.be.eqls([]);
                    expect(getAllStub.callCount).to.be.equal(1);
                    expect(parseFormPaymentStub.callCount).to.be.equal(1);
                    getAllStub.restore();
                    parseFormPaymentStub.restore();
                });
        });

        it('Should return formPayments', function(){
            var getAllStub = sinon.stub(formPaymentDAO, 'getAll');
            getAllStub
                .withArgs({userId: '5bddd5a80a1cad1e079a334c'})
                .returns([{_id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435759)},
                          {_id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435758)},
                          {_id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435757)}]);

            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');
            parseFormPaymentStub
                .withArgs([{_id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435759)},
                           {_id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435758)},
                           {_id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'creditCard',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435757)}])
                .returns([{id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'creditCard'},
                          {id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'creditCard'},
                          {id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'creditCard'}]);

            return formPaymentBO.getAll({userId: '5bddd5a80a1cad1e079a334c'})
                .then(function(formPayments){
                    expect(formPayments).to.be.eqls([{id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'creditCard'},
                                                     {id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'creditCard'},
                                                     {id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'creditCard'}]);
                    expect(getAllStub.callCount).to.be.equal(1);
                    expect(parseFormPaymentStub.callCount).to.be.equal(1);
                    getAllStub.restore();
                    parseFormPaymentStub.restore();
                });
        });
    });

    describe('getById', function(){
        it('should return error when body does not exist', function() {
            var getByIdStub = sinon.stub(formPaymentDAO, 'getById');
            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');

            return formPaymentBO.getById()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseFormPaymentStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseFormPaymentStub.restore();
                    });
        });
        it('should return error when body does not contains the field id', function() {
            var getByIdStub = sinon.stub(formPaymentDAO, 'getById');
            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');

            return formPaymentBO.getById({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseFormPaymentStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseFormPaymentStub.restore();
                    });
        });
        it('should return an empty object when id does not exist', function() {
            var getByIdStub = sinon.stub(formPaymentDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b7')
                .returns({});
            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');

            return formPaymentBO.getById({id: '5bbead798c2a8a92339e88b7'})
                    .then(function(user){
                        expect(user).to.be.eqls({});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseFormPaymentStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseFormPaymentStub.restore();
                    });
        });
        it('should return a formPayment when id belongs to some form of payment', function() {
            var getByIdStub = sinon.stub(formPaymentDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b8')
                .returns({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'creditCard', isEnabled: true, creationDate: Date(1546653595338)});

            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');
            parseFormPaymentStub
                .withArgs({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'creditCard', isEnabled: true, creationDate: Date(1546653595338)})
                .returns({id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'creditCard'});

            return formPaymentBO.getById({id: '5bbead798c2a8a92339e88b8'})
                    .then(function(formPayment){
                        expect(formPayment).to.be.eqls({id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'creditCard'});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseFormPaymentStub.callCount).to.be.equals(1);
                        getByIdStub.restore();
                        parseFormPaymentStub.restore();
                    });
        });
    });

    describe('balances', function(){
        it('Should return error when body does not exist', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');

            return formPaymentBO.balances()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('UserId are required');
                        expect(balancesStub.callCount).to.be.equal(0);
                        expect(parseBalanceStub.callCount).to.be.equal(0);
                        balancesStub.restore();
                        parseBalanceStub.restore();
                    });
        });
        it('Should return error when body does not contains the field id', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');

            return formPaymentBO.balances({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('UserId are required');
                        expect(balancesStub.callCount).to.be.equal(0);
                        expect(parseBalanceStub.callCount).to.be.equal(0);
                        balancesStub.restore();
                        parseBalanceStub.restore();
                    });
        });
        it('Should return a empty object when userId does not have a formPayment', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            balancesStub
                .withArgs({userId: '5bbead798c2a8a92339e88b1'})
                .returns([]);

            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');
            parseBalanceStub
                .withArgs([])
                .returns([]);

            return formPaymentBO.balances({userId: '5bbead798c2a8a92339e88b1'})
                    .then(function(balances) {
                        expect(balances).to.be.eqls([]);
                        expect(balancesStub.callCount).to.be.equal(1);
                        expect(parseBalanceStub.callCount).to.be.equal(1);
                        balancesStub.restore();
                        parseBalanceStub.restore();
                    });
        });
        it('Should return a array with balances when userId have a formsPayment', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            balancesStub
                .withArgs({userId: '5bbead798c2a8a92339e88b2'})
                .returns([{_id : '5c216945b7a96c6cf78f5df6', balance : -99},
                          {_id : '5c1dd2322aa198732f07ad65', balance : -500}]);

            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');
            parseBalanceStub
                .withArgs([{_id : '5c216945b7a96c6cf78f5df6', balance : -99},
                           {_id : '5c1dd2322aa198732f07ad65', balance : -500}])
                .returns([{id : '5c216945b7a96c6cf78f5df6', balance : -99},
                          {id : '5c1dd2322aa198732f07ad65', balance : -500}]);

            return formPaymentBO.balances({userId: '5bbead798c2a8a92339e88b2'})
                    .then(function(balances) {
                        expect(balances[0]).to.be.eqls({id : '5c216945b7a96c6cf78f5df6', balance : -99});
                        expect(balances[1]).to.be.eqls({id : '5c1dd2322aa198732f07ad65', balance : -500});
                        expect(balancesStub.callCount).to.be.equal(1);
                        expect(parseBalanceStub.callCount).to.be.equal(1);
                        balancesStub.restore();
                        parseBalanceStub.restore();
                    });
        });
        it('Should return filtered balances per day', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            balancesStub
                .withArgs({userId: '5bbead798c2a8a92339e88b2', initialDate: new Date(1545506568424), finalDate: new Date(1545906578424)})
                .returns([{_id : '5c216945b7a96c6cf78f5df6', balance : -49},
                          {_id : '5c1dd2322aa198732f07ad65', balance : -40}]);

            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');
            parseBalanceStub
                .withArgs([{_id : '5c216945b7a96c6cf78f5df6', balance : -49},
                           {_id : '5c1dd2322aa198732f07ad65', balance : -40}])
                .returns([{id : '5c216945b7a96c6cf78f5df6', balance : -49},
                          {id : '5c1dd2322aa198732f07ad65', balance : -40}]);

            return formPaymentBO.balances({userId: '5bbead798c2a8a92339e88b2', initialDate: new Date(1545506568424), finalDate: new Date(1545906578424)})
                    .then(function(balances) {
                        expect(balances[0]).to.be.eqls({id : '5c216945b7a96c6cf78f5df6', balance : -49});
                        expect(balances[1]).to.be.eqls({id : '5c1dd2322aa198732f07ad65', balance : -40});
                        expect(balancesStub.callCount).to.be.equal(1);
                        expect(parseBalanceStub.callCount).to.be.equal(1);
                        balancesStub.restore();
                        parseBalanceStub.restore();
                    });
        });
    });
});
