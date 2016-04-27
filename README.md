# nodejs-blog
just for me [http://hacking.pub](http://hacking.pub)  
you can see the blogs [http://hacking.pub/blog](http://hacking.pub.blog)  
now I will write an OnlineChessGame.....

# 目前所做项目
# 中国象棋游戏

#### 采用express, socketio
代码目录(只列举与本游戏相关的)：  
app.js  
consfig.json  
log -> log4.js  
models-> db.js gameuser.js  
　　　　chessgame-> chessroomctr.js datastruct.js gamectr.js msgrouter.js playerctr.js 
packgae.json  
public-> images  
　　　 javascript  
　　　 stylesheets  
routes-> chessgame.js  
view-> chessgame.html  

###### app.js
```
...
//chat.simple_chat 是之前写的简单聊天室
//chessgaemsg 是将 游戏的主逻辑抽象出的model 导出
var chat = require('./models/chat');
var chessgamemsg = require('./models/chessgame/msgrotuer.js');
var io = require('socket.io')(server);
chat.simple_chat(io);
chessgamemsg.StartGameListen(io);

//采用session-mongoose保存session
app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	next();
});
...

//主页面请求get，返回chessgame.html。其他请求都是ajax，返回json。
app.get('/chessgame', chessgame.index);
app.post('/chessgame/userlogin', chessgame.userlogin);
app.post('/chessgame/userreg', chessgame.userreg);
app.post('/chessgame/userunreg', chessgame.userunreg);
```
