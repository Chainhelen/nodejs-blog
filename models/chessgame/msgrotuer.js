//require some *.js
var logger       = require('../../log/log4.js').log('chessgame');
var PlayerCtr    = require('./playerctr.js');
var ChessRoomCtr = require('./chessroomctr.js');
var GameCtr      = require('./gamectr.js');
var DS           = require('./datastruct.js');

/* name      : doLogin
 * function  : the player login in the game 
 * parameter : gamectrset , the set of game controller
 *             loginmsg, the message from client about login
 * return    : 
 */
function doLogin(cursocket, gamectrset, loginmsg){
    //check login authentication
    if("undefined" == loginmsg || null == loginmsg){
        logger.LOG("error", "the socket msg:auth maybe wrong" , null, null);
    }
    logger.LOG('debug', loginmsg, null, null);
    logger.LOG('info', 'player:' + loginmsg.id + ' trying to login the game' , null, null);

    //get or add player object from loginmsg
    var player = gamectrset.getPlayer(loginmsg.id);
    if(player){
        //need to write
    } else { // add a player
        player = PlayerCtr.newPlayer();
        player.setId(loginmsg.id);
        player.setSocket(cursocket);

        gamectrset.addPlayer(player);
        gamectrset.addSocket(cursocket);

        logger.LOG('info', 'player:' + loginmsg.id + ' login the game successfully' , null, null);
    }
}

/* name      : StartGameListen
 * function  : listen to some msg
 * parameter : socket io
 * return    : void
 */
exports.StartGameListen = function(io) {
    var gamectrset = GameCtr.newGameCtrSet();

    io.of('/chessgame').on('connection', function(cursocket){
        cursocket.emit('socket link successfully');
        logger.LOG('info', 'socket:' + cursocket.id +' link successfully' , null, null);

        cursocket.on('login', function(loginmsg){
            console.log(loginmsg);
            doLogin(cursocket, gamectrset, loginmsg);
        });
    });
}
