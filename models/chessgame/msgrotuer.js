//require some *.js
var logger       = require('../../log/log4.js').log('chessgame');
var PlayerCtr    = require('./playerctr.js');
var ChessRoomCtr = require('./chessroomctr.js');
var GameCtr      = require('./gamectr.js');
var DS           = require('./datastruct.js');
var socketioJwt  = require("socketio-jwt");
var config       = require('../../config.json');
var gamedb = require('../gameuser.js');

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

/* name      : StartGameListen
 * function  : listen to some msg
 * parameter : socket io
 * return    : void
 */
exports.StartGameListen = function(io) {
    var gamectrset = GameCtr.newGameCtrSet();

    gamedb.allUser(function(err, obj){
        if(err){
            logger.Log('error', err);
        }
        if(!obj.length){
        }
    });

/*    io.set('authorization', socketioJwt.authorize({
        secret: config.JwtSecret,
        handshake: true
    }));*/

    var nsp = io.of('/chessgame');
    nsp.use(socketioJwt.authorize({
        secret: config.JwtSecret,
        handshake: true
    }));

    nsp.on('connection', function(cursocket){
        cursocket.emit('loginsucess');
        logger.LOG('info', 'socketid:' + cursocket.id + 
                '; username : ' + cursocket.decoded_token.username, 'connected', null , null);

        cursocket.broadcast.emit('newuserlogin', {username : cursocket.decoded_token.username});

        cursocket.on('disconnection', function(){
        });
/*        cursocket.on('logingame', function(logingamemsg){
            console.log(logingamemsg);
            doLoginGame(cursocket, gamectrset, logingamemsg);
        });*/
    });
}
