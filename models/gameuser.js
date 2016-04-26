var db = require('./db');
var Schema = db.mongoose.Schema;

var gameUserSchema = new Schema({
    username: String,
    md5password: String
});

var gameStepSchema = new Schema({
    username: String,
    step    : String
});

var GameUser = db.mongoose.model('GameUser', gameUserSchema);
var GameStep = db.mongoose.model('GameStep', gameStepSchema);

var GameDAO = function(){};

GameDAO.prototype.userReg = function(obj, callback) {
    var instance = new GameUser({
        username: obj.username,
		md5password: obj.md5password
    });
    /*
    this.userFindByName(obj, function(){
    });*/
    instance.save(function(err){
        callback(err);
    });

};

GameDAO.prototype.userFindByName = function(name, callback){
    GameUser.findOne({
        username: name
    },
    function(err, obj){
        callback(err, obj);
    });
};

GameDAO.prototype.userUnReg = function(obj, callback){
//    GameUser.remove({
//        username : obj.username
//    }, function(e){
//        callback(e);
//    });
};

module.exports = new GameDAO();
