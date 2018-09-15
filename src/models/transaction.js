var mongoose = require('mongoose');

var model = null;

module.exports = function () {

    var transaction = mongoose.Schema({
        description: {
            type: String,
            required: true
        },
        value: {
            type: Float,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        purchaseDate: {
            type: Date,
            required: true
        },
        formPayment: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'FormPayment'
        },
        installments: {
            type: Float,
            required: false
        }
    });

    model = model ? model : mongoose.model('Transaction', transaction);

    return model;
};
