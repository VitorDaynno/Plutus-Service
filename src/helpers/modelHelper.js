module.exports = {
  parseUser: function(user) {
    if (Array.isArray(user)) {
      return user.map(function(item) {
        const entity = {};
        entity.id = item._id;
        entity.name = item.name;
        entity.email = item.email;
        return entity;
      });
    }
    const entity = {};
    entity.id = user._id;
    entity.name = user.name;
    entity.email= user.email;

    return entity;
  },
  parseAccount: function(account) {
    if (Array.isArray(account)) {
      return account.map(function(item) {
        const entity = {};
        entity.id = item._id;
        entity.name = item.name;
        entity.type = item.type;
        return entity;
      });
    }

    const entity = {};
    entity.id = account._id;
    entity.name = account.name;
    entity.type = account.type;

    return entity;
  },
  parseTransaction: function(transaction) {
    const _this = this;
    if (Array.isArray(transaction)) {
      return transaction.map(function(item) {
        const entity = {};
        entity.id = item._id;
        entity.description = item.description;
        entity.value = item.value;
        entity.categories = item.categories;
        entity.purchaseDate = item.purchaseDate;
        entity.account = _this.parseAccount(item.account);

        return entity;
      });
    }

    const entity = {};
    entity.id = transaction._id;
    entity.description = transaction.description;
    entity.value = transaction.value;
    entity.categories = transaction.categories;
    entity.purchaseDate = transaction.purchaseDate;
    entity.account = this.parseAccount(transaction.account);

    return entity;
  },
  parseBalance: function(balance) {
    if (Array.isArray(balance)) {
      return balance.map(function(item) {
        const entity = {};
        entity.id = item._id;
        entity.balance = item.balance;
        entity.name = item.account[0].name;
        return entity;
      });
    }
    const entity = {};
    entity.id = balance._id;
    entity.balance = balance.balance;
    entity.name = balance.account[0].name;
    return entity;
  },
};
