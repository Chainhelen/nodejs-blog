/*
 * GET home page.
 */
var blog = require('./blog.js');
var wsinfo = require('../models/wsInfo.js');

exports.oldindex = function(req, res) {
    res.render('oldindex');
};

exports.paint = function(req, res) {
    res.render('paint');
};

exports.website = function(req, res) {
    res.render('website');
};

exports.page = function(req, res) {
    res.render('page');
};

exports.simple_chat = function(req, res) {
    var target = {
        host:wsinfo.getIpv4(), 
        port:wsinfo.getPort()
    };

    var logger       = require('../log/log4.js').log('chat');
    logger.LOG('debug', target, null, null);

    res.render('simple_chat', {
        json: req.ip,
        target: target
    });
};

exports.mapbox = function(req,res){
    res.render('mapbox');
};

exports.baidumap = function(req, res){
    res.render('baidumap');
};

exports.indexone = function(req, res) {
    req.session.test = "seond test";

    if (!req.session.user) {
        res.render('index', {
            user: 'ni',
            title: 'Welcome',
            think: 'Please email to chainhelen@gmail.com'
        });
    } else {
        req.session.user = null;
        res.render('index', {
            title: 'Logout',
            think: '哎哟，又来一遍'
        })
    }
};

exports.indexpost = function(req, res) {
    var User = require('../models/user');
    var user = {};

    if(!req.body.username){
        res.render('index',{
            title: 'ERROR',
            think: '用户名不能为空'
        });
        return ;
    };

    if(!req.body.password){
        res.render('index',{
            title: 'ERROR',
            think: '密码不能为空'
        });
        return ;
    };

	if(!req.body.ccap || !req.session.ccap || req.session.ccap != req.body.ccap){
		req.session.ccap = null;
        res.render('index',{
            title: 'ERROR',
            think: '需要验证码'
        });
        return ;
	}
	req.session.ccap = null;

    User.findByName(req.body.username, function(err, obj) {
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');

        if (err) {
            console.log("not find");
        }

        if(!obj){
            console.log('password is not right');
            res.render('index', {
                title: 'ERROR',
                think: '错了,错了,不要乱改密码或者用户啊!'
            });
            return;
        }
        user["username"] = req.body.username;
        user["password"] = obj.password;

        if (req.body.username == user.username && md5.update(req.body.password).digest('hex') == user.password) {
            req.session.user = user;
            res.redirect('/admin_blog_index');
            return ;
        }

        res.render('index', {
            title: 'ERROR',
            think: '错了,错了,不要乱改密码或者用户啊!'
        });
    });
}
exports.indexAuth = function(req, res, next) {
    if (!res.locals.user) {
		res.redirect('/blog');
        return ;
    }
    next();
}
exports.welcome = function(req, res){
    res.render('welcome');
};
exports.cv = function(req, res){
    res.render('cv');
};
exports.sort = function (req, res){
    res.render('sort');
};
