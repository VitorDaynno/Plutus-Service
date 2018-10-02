var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var transaction = dependencies.transaction;

    return {
        dependencies: dependencies,

        save: function() {
            return new Promise(function(resolve, reject){
            });
        },

        getAll: function() {
            
        }
    };
};
