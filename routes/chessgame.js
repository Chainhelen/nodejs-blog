var gamedb = require('../models/gameuser.js');
var logger = require('../log/log4.js').log('chessgame');

var result = {
    userloginusernameisnull   : 'login failed, the username is null',
    userloginpasswordisnull   : 'login failed, the password is null',
    userloginsuccess          : 'login sucessfully',
    userhaslogin              : 'user has logged, please logout first',
    userloginpasswdwrong      : 'login failed, the password is wrong',
    userregusernameisnull     : 'reg failed, the username is null',
    userregpasswordisnull     : 'reg failed, the password is null',
    userregusernameexist      : 'reg failed, the username exist',
    userregsuccess            : 'reg sucessfully',
    internalerror             : 'Internal Error'
}

exports.index = function(req, res){
    res.render('chessgame');
};

exports.userlogin = function(req, res){
    if(null == req.body.username || "undefined" == typeof(req.body.username) || 0 == req.body.username.length){
        res.json({
            result : result["userloginusernameisnull"]
        });
        return ;
    }
    if(null == req.body.password || "undefined" == typeof(req.body.password) || 0 == req.body.password.length){
        res.json({
            result : result["userloginpasswordisnull"]
        });
        return ;
    }
    if(req.session.userlogin){
        res.json({
            result:result["userloginpasswdwrong"]
        });
        return ;
    }

    gamedb.userFindByName(req.body.username, function(err, obj){
        if(err){
            res.json({
                result: result["internalerror"]
            });
            logger.LOG('error', 'user ' + JSON.stringify(req.body) + ' from post login failed', null, null);
            logger.LOG('error', err, null, null);
        } else {
            var crypto = require('crypto');
            var md5 = crypto.createHash('md5');
            var postobj = {
                username    : req.body.username,
                md5password : md5.update(req.body.password).digest('hex')
            };

            logger.LOG('debug', 'user from post is ' +  JSON.stringify(postobj), null, null);
            logger.LOG('debug', 'user from db   is ' +  JSON.stringify(obj)     , null, null);
            if(postobj.md5password == obj.md5password){
                res.json({
                    result:result["userloginsuccess"]
                });
                req.session.userlogin = postobj;
                logger.LOG('info', 'user ' + JSON.stringify(req.body) + ' login sucessfully', null, null);
            } else {
                res.json({
                    result:result["userloginpasswdwrong"]
                });
                logger.LOG('info', 'user ' + JSON.stringify(req.body) + ' log failed, password is wrong', null, null);
            }
        }
    });
}

exports.userreg = function(req, res){
    if(null == req.body.username || "undefined" == typeof(req.body.username) || 0 == req.body.username.length){
        res.json({
            result : result["userregusernameisnull"]
        });
    }
    if(null == req.body.password || "undefined" == typeof(req.body.password) || 0 == req.body.password.length){
        res.json({
            result : result["userregpasswordisnull"]
        });
    }

    gamedb.userFindByName(req.body.username, function(err, obj){
        if(err){
            res.json({
                result: result["internalerror"]
            });
            logger.LOG('error', 'user ' + JSON.stringify(req.body) + ' from post reg failed', null, null);
            logger.LOG('error', err, null, null);
        }
        if(obj){
            logger.LOG('info', 'user ' + req.body.username + 'reg failed, the user exist', null, null);
            res.json({
                result: result["userregusernameexist"]
            });
        } else {
            var crypto = require('crypto');
            var md5 = crypto.createHash('md5');
            var postobj = {
                username    : req.body.username,
                md5password : md5.update(req.body.password).digest('hex')
            };

            gamedb.userReg(postobj, function(err){
                if(err){
                    res.json({
                        result: result["internalerror"]
                    });
                    logger.LOG('error', 'user ' + JSON.stringify(req.body) + ' from post reg failed', null, null);
                    logger.LOG('error', err, null, null);
                } else {
                    res.json({
                        result: result["userregsuccess"]
                    });
                    logger.LOG('info', 'user ' + JSON.stringify(req.body) + ' reg sucessfully', null, null);
                }
            });
        }
    });
}

exports.userunreg = function(req, res){
}
