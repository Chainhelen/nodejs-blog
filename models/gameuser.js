var db = require('./db').getChessgameDB();
var Schema = db.Schema;

var gameUserSchema = new Schema({
    username: String,
    md5password: String
});

var gameStepSchema = new Schema({
    username: String,
    step    : String
});

var GameUser = db.model('GameUser', gameUserSchema);
var GameStep = db.model('GameStep', gameStepSchema);

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
    GameUser.remove({
        username : obj.username
    }, function(e){
        callback(e);
    });
};

GameDAO.prototype.allUser = function(callback){
    GameUser.find(function(err, users){
        callback(err, users);
    });
};

module.exports = new GameDAO();
