var config = require('../config.json');
var logger = require('../log/log4.js').log('mongoose');
var mongoose = require('mongoose');

var blogdbconnection = null;
var chessdbconnection = null;

exports.getBlogDBCon = function() {
    if(!blogdbconnection ){
        var dbURL = config.blog_mongodb.dbURL;
        blogdbconnection = mongoose.createConnection(dbURL);
        blogdbconnection.Schema = mongoose.Schema;

        blogdbconnection.on('connected', function(){
            logger.LOG('info', 'Mongoose  connect to blogdb success', null, null);
        });
        blogdbconnection.on('error', function(err) {
            logger.LOG('error', 'Mongoose connect to blogdb error: ' + err, null, null);
        });
        blogdbconnection.on('disconnected', function() {
            logger.LOG('error', 'Mongoose disconnected blogdb', null, null);
        });
    }
    return blogdbconnection;
}

exports.getChessgameDBCon = function() {
    if(!chessdbconnection){
        var dbURL = config.chessgame_mongodb.dbURL;
        chessdbconnection = mongoose.createConnection(dbURL);
        chessdbconnection.Schema = mongoose.Schema;

        chessdbconnection.on('connected', function(){
            logger.LOG('info', 'Mongoose  connect to chessgamedb success', null, null);
        });
        chessdbconnection.on('error', function(err) {
            logger.LOG('error', 'Mongoose connection chessgamedb error: ' + err, null, null);
        });
        chessdbconnection.on('disconnected', function() {
            logger.LOG('error', 'Mongoose disconnected chessgamedb', null, null);
        });
    }

    return chessdbconnection;
}
