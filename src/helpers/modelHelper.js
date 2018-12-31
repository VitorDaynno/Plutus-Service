module.exports = {
    parseUser: function(user){
        var entity = {};
        entity.id = user._id;
        entity.name = user.name;
        entity.email= user.email;

        return entity;
    },
    parseFormPayment: function(formPayment){
        if (Array.isArray(formPayment)) {
            return formPayment.map(function(item){
                var entity = {};
                entity.id = item._id;
                entity.name = item.name;
                entity.type = item.type;
                return entity;
            });
        }

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
    },
    parseBalance: function(balance){
        if (Array.isArray(balance)) {
            return balance.map(function(item){
                var entity = {};
                entity.id = item._id;
                entity.balance = item.balance;
                entity.name = item.formPayment[0].name;
                return entity;
            });
        }
        var entity = {};
        entity.id = balance._id;
        entity.balance = balance.balance;
        entity.name = balance.formPayment[0].name;
        return entity;
    }
};
