var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var FormPaymentBO = require('../../../src/business/formPaymentBO');
var DAOFactory = require('../../../src/factories/factoryDAO');
var ModelHelper = require('../../../src/helpers/modelHelper');

describe('FormPaymentBO', function(){

    var formPaymentDAO = DAOFactory.getDAO('formPayment');

    var formPaymentBO = new FormPaymentBO({
        formPaymentDAO: formPaymentDAO,
        modelHelper: ModelHelper
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
                .returns({_id: '5bbead798c2a8a92339e88b8', name: 'Nubank', type: 'Crédito'});

            var parseFormPaymentStub = sinon.stub(ModelHelper, 'parseFormPayment');
            parseFormPaymentStub
                .withArgs({_id: '5bbead798c2a8a92339e88b8', name: 'Nubank', type: 'Crédito'})
                .returns({id: '5bbead798c2a8a92339e88b8', name: 'Nubank', type: 'Crédito'});

            return formPaymentBO.getById({id: '5bbead798c2a8a92339e88b8'})
                    .then(function(formPayment){
                        expect(formPayment).to.be.eqls({id: '5bbead798c2a8a92339e88b8', name: 'Nubank', type: 'Crédito'});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseFormPaymentStub.callCount).to.be.equals(1);
                        getByIdStub.restore();
                        parseFormPaymentStub.restore();
                    });
        });
    });
});
