var util = require('util');

module.exports = {
    mongoUrl: util.format('mongodb://%s/dashboard', process.env.DB || 'localhost'),
    servicePort: process.env.PORT || 5000,
    isMongoDebug: true
};
