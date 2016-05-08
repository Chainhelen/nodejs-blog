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
            logger.LOG('error', err);
        }
        obj.forEach(function(dbplayer){
            var player = PlayerCtr.newPlayer();
            player.setName(dbplayer.username);
            gamectrset.addPlayer(player);
        });
        logger.LOG('info', gamectrset.players);
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
        cursocket.emit('system', {
            type         : 'loginsucess'
        });

        logger.LOG('info', 'socketid:' + cursocket.id + 
                '; username : ' + cursocket.decoded_token.username + ' connected', null , null);

        var curinfo = {
            socket : null,
            player : null
        };
        //send message all player that a new user login
        var broadcastplayers = [];
        gamectrset.players.forEach(function(player){
            if(player.name == cursocket.decoded_token.username){
                if(player.getSocket()){
                    gamectrset.removeSocket(player.getSocket());
                    player.getSocket().emit('system', {
                        type : 'userotherplacelogin'
                    });
                    player.getSocket().disconnect(true);
                    player.setStatus(DS.PlayerStatus["OffLineStatus"]);
                }
                gamectrset.addSocket(cursocket);
                player.setSocket(cursocket);
                player.setStatus(DS.PlayerStatus["OnLineStatus"]);

                curinfo.socket = cursocket;
                curinfo.player = player;
            }
            //need to add
            //
            broadcastplayers.push({
                username : player.getName(),
                curstatus: player.getStatus()
            });
        });

        gamectrset.sockets.forEach(function(socket){
            socket.emit('system', {
                type         : 'newuserlogin',
                newloginuser : curinfo.player.getName(),
                allplayers   : broadcastplayers
            });
        });

/*        cursocket.broadcast.emit('system', {
            type         : 'newuserlogin',
            newloginuser : cursocket.decoded_token.username,
            allplayers   : broadcastplayers
        });*/
        logger.LOG('debug', 'broadcast emit' + JSON.stringify(broadcastplayers) , null , null);

        cursocket.on('system', function(json){
            if(json.type == 'userlogout'){
                cursocket.disconnect(true);
            }
        });

        cursocket.on('disconnect', function(){
            logger.LOG('info', 'curplayer disconnect ' + curinfo.player.getName() , null , null);
            gamectrset.removeSocket(curinfo.player.getSocket());
            curinfo.player.setStatus(DS.PlayerStatus["OffLineStatus"]);

            broadcastplayers.forEach(function(player){
                if(player.username == curinfo.player.getName()){
                    player.curstatus = DS.PlayerStatus["OffLineStatus"];
                }
            });

            logger.LOG('debug', 'gamectrset.players ' + JSON.stringify(broadcastplayers) , null , null);

            gamectrset.sockets.forEach(function(socket){
                socket.emit('system', {
                    type         : 'userlogout',
                    allplayers   : broadcastplayers
                });
            });
        });
/*        cursocket.on('logingame', function(logingamemsg){
            console.log(logingamemsg);
            doLoginGame(cursocket, gamectrset, logingamemsg);
        });*/
    });
}
