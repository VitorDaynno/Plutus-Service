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
    },
    parseTransaction: function(transaction){
        var entity = {};
        entity.id = transaction._id;
        entity.description = transaction.description;
        entity.value = transaction.value;
        entity.category = transaction.category;
        entity.purchaseDate = transaction.purchaseDate;
        entity.formPayment = transaction.formPayment;

        return entity;
    }
};
