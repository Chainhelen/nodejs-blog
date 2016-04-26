var mongoose = require('mongoose');
var config = require('../config.json');
var logger = require('../log/log4.js').log('mongoose');

var dbURL = config.blog_mongodb.dbURL;
mongoose.connect(dbURL);

mongoose.connection.on('error', function(err) {
	logger.LOG('error', 'Mongoose connection error: ' + err, null, null);
});
mongoose.connection.on('disconnected', function() {
	logger.LOG('error', 'Mongoose disconnected', null, null);
});

exports.mongoose = mongoose;
