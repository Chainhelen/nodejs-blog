/**
 * Module dependencies.
 */

var express = require('express');

var routes = require('./routes');
var sina = require('./routes/sina');
var sources = require('./routes/sources');
var blog = require('./routes/blog');
var chat = require('./models/chat');
var chessgamemsg = require('./models/chessgame/msgrotuer.js');
var chessgame = require('./routes/chessgame.js');
var slide = require('./routes/slide');
var fourzorefour = require('./routes/fourzorefour.js');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var SessionStore = require("session-mongoose")(express);
var ccap = require('./routes/ccap');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var config=require('./config.json')

//chat
chat.simple_chat(io);
chessgamemsg.StartGameListen(io);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
//app.use(express.favicon());

app.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.cookieSession({
	secret: config.cookie.secret
}));
app.use(express.session({
	secret: config.session.secret,
	store: new SessionStore({
		url: config.session.dburl,
		interval: config.session.interval
	}),
	cookie: {
		maxAge: config.cookie.maxAge 
	}
}));

app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	next();
});

//change public router to pritor the router
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//no auth
app.get('/chessgame', chessgame.index);
app.post('/chessgame/userlogin', chessgame.userlogin);
app.post('/chessgame/userreg', chessgame.userreg);
app.post('/chessgame/userunreg', chessgame.userunreg);

app.get('/mapbox', routes.mapbox);
app.get('/helloworld', routes.helloworld);
app.get('/particle', routes.particle);
app.get('/baidumap',routes.baidumap);
app.get('/unity', sina.unity);
app.get('/cv', routes.cv);
app.get('/myEnglishSlide',slide.myEnglishSlide);
app.get('/paint', routes.paint);
app.get('/chat', routes.simple_chat);
app.get('/sort', routes.sort);
app.get('/blog/:what?',blog.index);
app.get('/user/:user/:article', blog.user_blog_article);
app.get('/user/:user', blog.user_blog_index);
app.get('/ccap',ccap.index);
app.get(/\/\S+/, routes.indexAuth);

app.get('/admin_blog_index',blog.blog_fix_status);
app.get('/admin_blog/:what?', blog.admin_get);
app.post('/admin_blog/:what?', blog.admin_post);

app.get('/', routes.indexone);
app.post('/', routes.indexpost);

app.post('/json/blog/',blog.json);
app.post('/json/blog_delete/',blog.blog_delete);

app.get('/welcome', routes.welcome);

app.get('/index', routes.oldindex);
app.get('/website', routes.website);

app.get('/sina/example1', sina.example1);
//app.get('/study/:content', study.script);
app.get('/downloads/:filename', sources.downloads);
app.get('/downloads/*', sources.err);
app.get('/?*', fourzorefour.one);

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
