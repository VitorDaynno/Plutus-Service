module.exports = {
    parseUser: function(user){
        var entity = {};
        entity.id = user._id;
        entity.name = user.name;
        entity.email= user.email;

        return entity;
    }
};
