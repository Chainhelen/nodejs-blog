var db = require('./db');
var Schema = db.mongoose.Schema;

var blogSchema = new Schema({
	title: String,
	content: String,
	type: String,
	date: String,
	author: String 
})

var Blog = db.mongoose.model('Blog', blogSchema);
var BlogDAO = function() {};

BlogDAO.prototype.saveDocs = function(obj, callback){
	var instance = new Blog({
		title: obj.body.title,
		content: obj.body.content,
		type: obj.body.type,
		date: obj.body.date,
		author: obj.body.author
	});
	instance.save(function(err){
		callback(err);
	});
};

BlogDAO.prototype.findALLByAuthor = function(pauthor, callback){
	Blog.find({
		author: pauthor
	}, function(e, docs){
		callback(e, docs);
	});
}

BlogDAO.prototype.findALLByTitle = function(pTitle, callback){
	Blog.find({
		title: pTitle
	}, function(e, docs){
		callback(e, docs);
	});
}

BlogDAO.prototype.findALLByTitleAndAuthor = function(key, callback){
	Blog.find({
		title : key["title"],
		author: key["author"]
	}, function(e, docs){
		callback(e, docs);
	});
}

BlogDAO.prototype.updateByTitle = function(pTitle, pcontent, callback){
	Blog.update({
		title: pTitle
	}, {
		content: pcontent
	},function(e, number, raw){
		callback(e, number, raw);
	});
}

module.exports = new BlogDAO();
