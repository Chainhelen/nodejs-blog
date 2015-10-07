var mongoose = require('mongoose');
var config = require('../config.json');

var dbURL = config.blog_mongodb.dbURL;
mongoose.connect(dbURL);

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

exports.mongoose = mongoose;
