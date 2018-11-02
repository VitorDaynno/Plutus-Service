var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var formPayment = dependencies.formPayment;

    return {
        dependencies: dependencies,

        getById: function() {
            return new Promise(function(resolve, reject){
                resolve();
            });
        }
    };
};
