var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var FormPaymentDAO = require('../../../src/daos/formPaymentDAO');
var formPaymentModel = require('../../../src/models/formPayment')();
require('sinon-mongoose');

describe('formPaymentDAO', function(){

    var formPaymentDAO = new FormPaymentDAO({
        formPayment: formPaymentModel
    });

    describe('save', function(){
        it('Should return a formPayment when a document transaction contain all fields', function(){
            var createStub = sinon.mock(formPaymentModel).expects('create')
                .withArgs({name: 'Card 1', type: 'creditCard'})
                .resolves({_id: '5bddd5a80a2cad1e079a334c', name: 'Card 1', type: 'creditCard'});

            return formPaymentDAO.save({name: 'Card 1', type: 'creditCard'})
                .then(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getById', function(){
        it('Should return empty object when id dont exist', function(){
            var findByStub = sinon.mock(formPaymentModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b7')
                .chain('exec')
                .resolves({});

            return formPaymentDAO.getById('5bbead798c2a8a92339e88b7')
                .then(function(){
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a form of payment when id exist', function(){
            var findByStub = sinon.mock(formPaymentModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b8')
                .chain('exec')
                .resolves({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'creditCard'});

            return formPaymentDAO.getById('5bbead798c2a8a92339e88b8')
                .then(function(formPayment){
                    expect(formPayment).to.be.eqls({_id: '5bbead798c2a8a92339e88b8', name: 'Card 1', type: 'creditCard'});
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    })
});