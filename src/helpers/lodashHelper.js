var _ = require('lodash');

module.exports = {
    clone: function(entity){
        return _.cloneDeep(entity._doc);
    }
};
