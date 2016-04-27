var config = require('../config.json');
var logger = require('../log/log4.js').log('mongoose');

exports.getBlogDB = function() {
    var mongoose = require('mongoose');

    var dbURL = config.blog_mongodb.dbURL;
    mongoose.connect(dbURL);

    mongoose.connection.on('error', function(err) {
        logger.LOG('error', 'Mongoose connection blogdb error: ' + err, null, null);
    });
    mongoose.connection.on('disconnected', function() {
        logger.LOG('error', 'Mongoose disconnected blogdb', null, null);
    });
    return mongoose;
}

exports.getChessgameDB = function() {
    var mongoose = require('mongoose');

    var dbURL = config.chessgame_mongodb.dbURL;
    mongoose.connect(dbURL);

    mongoose.connection.on('error', function(err) {
        logger.LOG('error', 'Mongoose connection chessgame error: ' + err, null, null);
    });
    mongoose.connection.on('disconnected', function() {
        logger.LOG('error', 'Mongoose disconnected chessgame', null, null);
    });
    return mongoose;
}
