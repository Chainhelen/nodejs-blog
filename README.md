# nodejs-blog
just for me [http://hacking.pub](http://hacking.pub)  
you can see the blogs [http://hacking.pub/blog](http://hacking.pub.blog)  
now I will write an OnlineChessGame.....
***
# 目前添加的项目
### 中国象棋游戏

#### 采用express, socketio
代码目录(只列举与本游戏相关的)：  
app.js  
consfig.json  
log -> log4.js  
models-> db.js gameuser.js  
　　　-> chessgame-> chessroomctr.js datastruct.js gamectr.js msgrouter.js playerctr.js 
packgae.json  
public-> images  
　　　 javascript  
　　　 stylesheets  
routes-> chessgame.js  
view-> chessgame.html  

##### 以下为代码片段解释
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
###### log4/log4.js
封装log4js打印log，保证可维护性。由其他模块require调用。  
不同业务逻辑，采用loglelve打印不同等级日志。  
同一业务逻辑，采用不同LogSwith，控制不同的日志输出
```
// the level of log, if not setting in list, it will be set "info"
var loglevel = {
    'chessgame' : 'debug',
    'chat'      : 'debug',
    'mongoose'  : 'info'
}
//log function 
exports.log = function(name){
    var logger = log4js.getLogger(name);
    if(loglevel[name]){
        logger.setLevel(loglevel[name]);
    } else {
        logger.setLevel("info");
    }
    logger.LOG = function (LogSwitch, showstring, callback, callbackparameter){
        if(null != showstring){
            if("trace" == LogSwitch){
                logger.trace(showstring);
            } else if("debug" == LogSwitch){
                logger.debug(showstring);
            } 
        }
        ...
        callback(callbackparameter);
    };
    return logger;
};
```

###### models/db.js
exports 导出的对象 改成了具有两个函数属性getBlogDB，getChessgameDB的对象
用于连接数据库，这么改成两个属性的主要是因为想把游戏的后台数据库与node-blog原先的blog数据库分开。

###### models/gameuser.js  
require('./db.js').getClessgameDB()，拿到连接db的对象。原型类构造器GameUser。  
　　　GameUserprototype.userReg: 注册游戏user  
　　　GameUserprototype.useFindByName: 查找某一用户从注册游戏user列表  
　　　GameUserprototype.userUnReg: 删除游戏user  
###### models/chessgame/datastruct.js
共有的数据结构(尚未完善)
```
var DS = {};
//Class Name
DS.ClassType = {
    "PlayerClassType"       :   "ChessPlayer",
    "ChessRoomClassType"    :   "ChessRoom",
    "ControllerClassType"   :   "Controller",
    "AuthClassType"         :   "AuthClass"
}
//Game running error
DS.GameError = {
    "PlayerExceptionError":               0,
    "AlereadyInTheRoomError":             1,
    "AlereadyInOtherRoomError":           2,
    "EnterTheRoomFailedError":            3,
    "RoomExceptionError":                 4
}
DS.GameStatus = {
} 
//player status
DS.PlayerStatus = {
    "OffLineStatus" :                        1,
    "GameRunningStatus" :                    2, 
    "PauseGameRunningStatus" :               3,
    "ExceptionStatus" :                      4
};
//chess room status
DS.ChessRoomStatus = {
    "GameRoomPauseStatus":               0,
    "GameRoomStartStatus":               1,
    "GameRoomStopStatus":                2,
    "GameRoomExceptionStatus":           3
}
module.exports = DS;
```
###### models/chessgame/chessroomctr.js
###### models/chessgame/playerctr.js
以上都是数据类型，分别chessroom，player的class控制器，包括class的一些操作
```
//chessroomctr.js 　room class  
var ChessRoom = function (id){
    this.id = null;
    this.player = [];
    this.observer = [];
    this.host = null;
};
/* name      : PlayerCtr.getPlayer
 * function  : get player object by playerid
 * parameter : playerid is the id of the player
 *             players is the array of players
 * return    : player object or null
*/
PlayerCtr.getPlayer = function(playerid, players) {
    for(var player in this.players){
        if(player.id == playerid){
            return player;
        }
    }
    return null;
}

//playctr.js 　play class
var ChessPlayer = function (){
    this.id = null;
    this.room = null;
    this.status = DS.PlayerStatus["offline"];
    this.socket = null;
};
```
###### models/chessgame/gamectr.js
游戏运行逻辑集合(尚未完善)
```
/* name      : GameCtrSet.prototype.EnterRoom
 * function  : player enter game room
 * parameter : player is  player object
               roomr is  roomId object
 * return    : true or false
*/
GameCtrSet.prototype.playerEnterRoomById = function (player, room) {
    //check the parameter :player
    if(Object != typeof(player)){
        logger.LOG("error", "Error Player Enter Room failed: the typeof player is " + 
                typeof(playerid), null, null);
        return false;
    }
    if(null === player){
        logger.LOG("error", "Error Player Enter Room failed: the player is null", null, null);
        return false;
    }
    if(DS.ClassType["PlayerClassType"] != player.constructor){
        logger.LOG("error", "Error Player Enter Room failed: the constructor player is " + 
                constructor(player), null, null);
        return false;
    } 

    //check the parameter :room
    if(Object != typeof(room)){
        logger.LOG("error", "Error Player Enter Room failed: the typeof room is " + 
                typeof(room), null, null);
        return false;
    }
    if(null == room){
        logger.LOG("error", "Error player Enter Room failed: the room is null", null, null);
        return false;
    }
    if(DB.ClassType["ChessRoomClassType"] != room.constructor){
        logger.LOG("error", "Error Player Enter Room failed: the constructor room is " + 
                constructor(room), null, null);
        return false;
    } 

    //check player status
    if(DB.PlayerStatus["OffLineStatus"] == player.status){
        logger.LOG("error", "Error Player Enter Room failed: the status of player is " + 
                "OffLineStatus", null, null);
        return false;
    }
    if(DB.PlayerStatus["GameRunningStatus"] == player.status){
        logger.LOG("error", "Error Player Enter Room failed: the status of player is " + 
                "GameRunningStatus", null, null);
        return false;
    }
    if(DB.PlayerStatus["PauseGameRunningStatus"] == player.status){
        logger.LOG("error", "Error Player Enter Room failed: the status of player is " + 
                "PauseGameRunningStatus", null, null);
        return false;
    }

    // check room status
    if(DB.PlayerStatus["GameRoomPauseStatus"] == room.status){
        logger.LOG("error", "Error Player Enter Room failed: the status of player is " + 
                "PauseGameRunningStatus", null, null);
        return false;
    }
    if(DB.PlayerStatus["GameRoomStartStatus"] == room.status){
        logger.LOG("error", "Error Player Enter Room failed: the status of room is " + 
                "GameRoomStartStatus", null, null);
        return false;
    }
    if(DB.PlayerStatus["GameRoomStopStatus"] == room.status){
        logger.LOG("error", "Error Player Enter Room failed: the status of room is " + 
                "GameRoomStopStatus", null, null);
        return false;
    }
    if(DB.PlayerStatus["GameRoomExceptionStatus"] == room.status){
        logger.LOG("error", "Error Player Enter Room failed: the status of room is " + 
                "GameRoomExceptionStatus", null, null);
        return false;
    }



    logger.LOG("info", "player " + this.id + " set " + " the room " + room.id + " success" , null, null);
    return true;
}
```
###### models/chessgame/msgrouter.js
游戏后端与页面websocket直接连接的逻辑，如下user登陆
```
/* name      : doLogin
 * function  : the player login in the game 
 * parameter : gamectrset , the set of game controller
 *             logingamemsg, the message from client about login
 * return    : 
 */
function doLoginGame(cursocket, gamectrset, logingamemsg){
    //check login authentication
    if("undefined" == logingamemsg || null == logingamemsg){
        logger.LOG("error", "the socket msg:auth maybe wrong" , null, null);
    }
    logger.LOG('debug', logingamemsg, null, null);
    logger.LOG('info', 'player:' + logingamemsg.id + ' trying to login the game' , null, null);

    //get or add player object from logingamemsg
    var player = gamectrset.getPlayer(logingamemsg.id);
    if(player){
        logger.LOG('info', 'player:' + logingamemsg.id + ' has logined the game' , null, null);
    } else { // add a player
        player = PlayerCtr.newPlayer();
        player.setId(logingamemsg.id);
        player.setSocket(cursocket);

        gamectrset.addPlayer(player);
        gamectrset.addSocket(cursocket);

        logger.LOG('info', 'player:' + logingamemsg.id + ' login the game successfully' , null, null);
    }
}
```

　　　
