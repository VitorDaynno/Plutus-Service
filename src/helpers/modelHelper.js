module.exports = {
    parseUser: function(user){
        var entity = {};
        entity.id = user._id;
        entity.name = user.name;
        entity.email= user.email;

        return entity;
    },
    parseFormPayment: function(formPayment){
        var entity = {};
        entity.id = formPayment._id;
        entity.name = formPayment.name;
        entity.type = formPayment.type;
        
        return entity;
    }
};
