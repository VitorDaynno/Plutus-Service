var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var AccountBO = require('../../../src/business/accountBO');
var DAOFactory = require('../../../src/factories/factoryDAO');
var ModelHelper = require('../../../src/helpers/modelHelper');
var DateHelper = require('../../../src/helpers/dateHelper');

var mongoose = require('mongoose');

describe('AccountBO', function(){

    var accountDAO = DAOFactory.getDAO('account');
    var transactionDAO = DAOFactory.getDAO('transaction');

    var accountBO = new AccountBO({
        accountDAO: accountDAO,
        transactionDAO: transactionDAO,
        modelHelper: ModelHelper,
        dateHelper: DateHelper
    });

    describe('add', function(){
        it('Should return error because Name does not informed', function(){
            return accountBO.add({type: 'credit', userId: '9bddd5a80a2cad1e079a334c'})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('The entity should has a field name');
                });
        });
        it('Should return error because Type does not informed', function(){
            return accountBO.add({name: 'Card 1', userId: '9bddd5a80a2cad1e079a334c'})
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

            var saveStub = sinon.stub(accountDAO, 'save');
            saveStub
                .withArgs({name: 'Card 1', type: 'credit', userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: DateHelper.now()})
                .returns({_id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c',isEnabled: true, creationDate: DateHelper.now()});

            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');
            parseAccountStub
                .withArgs({_id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: DateHelper.now()})
                .returns({id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'credit'});

            return accountBO.add({name: 'Card 1', type: 'credit', userId: '9bddd5a80a2cad1e079a334c'})
                .then(function(transaction){
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseAccountStub.callCount).to.be.equals(1);
                    expect(transaction).to.be.eqls({id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'credit'});
                    nowStub.restore();
                    saveStub.restore();
                    parseAccountStub.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return error because body does not exist', function(){
            var getAllStub = sinon.stub(accountDAO, 'getAll');
            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');

            return accountBO.getAll()
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equal(422);
                    expect(error.message).to.be.equal('UserId are required');
                    expect(getAllStub.callCount).to.be.equal(0);
                    expect(parseAccountStub.callCount).to.be.equal(0);
                    getAllStub.restore();
                    parseAccountStub.restore();
                });
        });

        it('Should return error because field userId does not exist', function(){
            var getAllStub = sinon.stub(accountDAO, 'getAll');
            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');

            return accountBO.getAll({})
                .then()
                .catch(function(error){
                    expect(error.code).to.be.equal(422);
                    expect(error.message).to.be.equal('UserId are required');
                    expect(getAllStub.callCount).to.be.equal(0);
                    expect(parseAccountStub.callCount).to.be.equal(0);
                    getAllStub.restore();
                    parseAccountStub.restore();
                });
        });

        it('Should return a empty array because userId does not have accounts', function(){
            var getAllStub = sinon.stub(accountDAO, 'getAll');
            getAllStub
                .withArgs({userId: '5bddd5a80a8cad1e079a334c'})
                .returns([]);

            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');
            parseAccountStub
                .withArgs([])
                .returns([]);

            return accountBO.getAll({userId: '5bddd5a80a8cad1e079a334c'})
                .then(function(accounts){
                    expect(accounts).to.be.eqls([]);
                    expect(getAllStub.callCount).to.be.equal(1);
                    expect(parseAccountStub.callCount).to.be.equal(1);
                    getAllStub.restore();
                    parseAccountStub.restore();
                });
        });

        it('Should return accounts', function(){
            var getAllStub = sinon.stub(accountDAO, 'getAll');
            getAllStub
                .withArgs({userId: '5bddd5a80a1cad1e079a334c'})
                .returns([{_id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435759)},
                          {_id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435758)},
                          {_id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435757)}]);

            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');
            parseAccountStub
                .withArgs([{_id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435759)},
                           {_id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435758)},
                           {_id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'credit',
                            userId: '9bddd5a80a2cad1e079a334c', isEnabled: true, creationDate: Date(1546568435757)}])
                .returns([{id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'credit'},
                          {id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'credit'},
                          {id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'credit'}]);

            return accountBO.getAll({userId: '5bddd5a80a1cad1e079a334c'})
                .then(function(accounts){
                    expect(accounts).to.be.eqls([{id: '5bddd5a80a2cad1e079a334d', name: 'Card 1', type: 'credit'},
                                                     {id: '5bddd5a80a2cad1e079a334e', name: 'Card 2', type: 'credit'},
                                                     {id: '5bddd5a80a2cad1e079a334f', name: 'Card 3', type: 'credit'}]);
                    expect(getAllStub.callCount).to.be.equal(1);
                    expect(parseAccountStub.callCount).to.be.equal(1);
                    getAllStub.restore();
                    parseAccountStub.restore();
                });
        });
    });

    describe('getById', function(){
        it('should return error when body does not exist', function() {
            var getByIdStub = sinon.stub(accountDAO, 'getById');
            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');

            return accountBO.getById()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseAccountStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseAccountStub.restore();
                    });
        });
        it('should return error when body does not contains the field id', function() {
            var getByIdStub = sinon.stub(accountDAO, 'getById');
            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');

            return accountBO.getById({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseAccountStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseAccountStub.restore();
                    });
        });
        it('should return an empty object when id does not exist', function() {
            var getByIdStub = sinon.stub(accountDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b7')
                .returns({});
            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');

            return accountBO.getById({id: '5bbead798c2a8a92339e88b7'})
                    .then(function(user){
                        expect(user).to.be.eqls({});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseAccountStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseAccountStub.restore();
                    });
        });
        it('should return a account when id belongs to some account', function() {
            var getByIdStub = sinon.stub(accountDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b8')
                .returns({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'credit', isEnabled: true, creationDate: Date(1546653595338)});

            var parseAccountStub = sinon.stub(ModelHelper, 'parseAccount');
            parseAccountStub
                .withArgs({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'credit', isEnabled: true, creationDate: Date(1546653595338)})
                .returns({id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'credit'});

            return accountBO.getById({id: '5bbead798c2a8a92339e88b8'})
                    .then(function(account){
                        expect(account).to.be.eqls({id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'credit'});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseAccountStub.callCount).to.be.equals(1);
                        getByIdStub.restore();
                        parseAccountStub.restore();
                    });
        });
    });

    describe('balances', function(){
        it('Should return error when body does not exist', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');

            return accountBO.balances()
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

            return accountBO.balances({})
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
        it('Should return a empty object when userId does not have a account', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            balancesStub
                .withArgs({userId: mongoose.Types.ObjectId('5bbead798c2a8a92339e88b1')})
                .returns([]);

            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');
            parseBalanceStub
                .withArgs([])
                .returns([]);

            return accountBO.balances({userId: '5bbead798c2a8a92339e88b1'})
                    .then(function(balances) {
                        expect(balances).to.be.eqls([]);
                        expect(balancesStub.callCount).to.be.equal(1);
                        expect(parseBalanceStub.callCount).to.be.equal(1);
                        balancesStub.restore();
                        parseBalanceStub.restore();
                    });
        });
        it('Should return a array with balances when userId have a account', function() {
            var balancesStub = sinon.stub(transactionDAO, 'balances');
            balancesStub
                .withArgs({userId: mongoose.Types.ObjectId('5bbead798c2a8a92339e88b2')})
                .returns([{_id : '5c216945b7a96c6cf78f5df6', balance : -99},
                          {_id : '5c1dd2322aa198732f07ad65', balance : -500}]);

            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');
            parseBalanceStub
                .withArgs([{_id : '5c216945b7a96c6cf78f5df6', balance : -99},
                           {_id : '5c1dd2322aa198732f07ad65', balance : -500}])
                .returns([{id : '5c216945b7a96c6cf78f5df6', balance : -99},
                          {id : '5c1dd2322aa198732f07ad65', balance : -500}]);

            return accountBO.balances({userId: '5bbead798c2a8a92339e88b2'})
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
                .withArgs({userId: mongoose.Types.ObjectId('5bbead798c2a8a92339e88b2'), initialDate: new Date(1545506568424), finalDate: new Date(1545906578424)})
                .returns([{_id : '5c216945b7a96c6cf78f5df6', balance : -49},
                          {_id : '5c1dd2322aa198732f07ad65', balance : -40}]);

            var parseBalanceStub = sinon.stub(ModelHelper, 'parseBalance');
            parseBalanceStub
                .withArgs([{_id : '5c216945b7a96c6cf78f5df6', balance : -49},
                           {_id : '5c1dd2322aa198732f07ad65', balance : -40}])
                .returns([{id : '5c216945b7a96c6cf78f5df6', balance : -49},
                          {id : '5c1dd2322aa198732f07ad65', balance : -40}]);

            return accountBO.balances({userId: '5bbead798c2a8a92339e88b2', initialDate: new Date(1545506568424), finalDate: new Date(1545906578424)})
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
