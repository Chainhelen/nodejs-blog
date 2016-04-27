var db = require('./db').getBlogDB();
var Schema = db.Schema;
var userSchema = new Schema({
	username: String,
	password: String
})
var User = db.model('User', userSchema);
var UserDAO = function() {};

UserDAO.prototype.save = function(obj, callback) {
	var instance = new User({
		username: obj.body.username,
		password: obj.body.password
	});
	instance.save(function(err) {
		callback(err);
	});
}

UserDAO.prototype.findByName = function(name, callback) {
	User.findOne({
		username: name
	},
	function(err, obj) {
		callback(err, obj);
	});
};
module.exports = new UserDAO();
