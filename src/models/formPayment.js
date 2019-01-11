var mongoose = require('mongoose');

var model = null;

module.exports = function () {

    var formPayment = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Users'
        },
        creationDate: {
            type: Date,
            required: true
        },
        modificationDate: {
            type: Date,
            required: false
        },
        exclusionDate: {
            type: Date,
            required: false
        },
        isEnabled: {
            type: Boolean,
            required: true
        }
    });

    model = model ? model : mongoose.model('FormPayment', formPayment);

    return model;
};
