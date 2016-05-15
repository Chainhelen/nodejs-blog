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
        logger.LOG("error", "the socket msg:auth maybe wrong");
    }
    logger.LOG('debug', logingamemsg);
    logger.LOG('info', 'player:' + logingamemsg.id + ' trying to login the game');

    //get or add player object from logingamemsg
    var player = gamectrset.getPlayer(logingamemsg.id);
    if(player){
        logger.LOG('info', 'player:' + logingamemsg.id + ' has logined the game');
    } else { // add a player
        player = PlayerCtr.newPlayer();
        player.setId(logingamemsg.id);
        player.setSocket(cursocket);

        gamectrset.addPlayer(player);

        logger.LOG('info', 'player:' + logingamemsg.id + ' login the game successfully');
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
        logger.LOG('debug', gamectrset.players);
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
                '; username : ' + cursocket.decoded_token.username + ' connected');

        var curinfo = {
            socket : null,
            player : null
        };
        //send message all player that a new user login
        var broadcastplayers = [];
        gamectrset.players.forEach(function(player){
            if(player.name == cursocket.decoded_token.username){
                if(player.getSocket()){
                    player.getSocket().emit('system', {
                        type : 'userotherplacelogin'
                    });
                    player.getSocket().disconnect(true);
                    player.setStatus(DS.PlayerStatus["OffLineStatus"]);
                }
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

        logger.LOG('debug', 'broadcast emit' + JSON.stringify(broadcastplayers));
        gamectrset.players.forEach(function(player){
            if(player.getSocket()){
                player.getSocket().emit('system', {
                    type         : 'newuserlogin',
                    curuser      : player.getName(),
                    allplayers   : broadcastplayers
                });
            }
        });

        cursocket.on('system', function(json){
            if(json.type == 'userlogout'){
                cursocket.disconnect(true);
            }
        });

        cursocket.on('invite', function(json){ 
            if(json.type == 'invite other to the room'){
                if(curinfo.player.getName() == json.otheruser){
                    cursocket.emit('invite' ,{
                        type : "can't invite yourself"
                    });
                } else if(!json.roomname || json.roomname == ''){
                    cursocket.emit('invite' ,{
                        type : "your room is wrong"
                    });
                } else {
                    logger.LOG('info', curinfo.player.getName() + ' invite ' +
                            json.otheruser + ' to room : ' + json.roomname);
                    var playerHasFound = false;
                    gamectrset.players.forEach(function(player){
                        if(json.otheruser == player.getName()){
                            playerHasFound = true;
                            //player is offline
                            if(player.getStatus() == DS.PlayerStatus["OffLineStatus"]){
                                curinfo.socket.emit('invite', {
                                    type            : "your invited user is offline",
                                    invitedusername : json.otheruser
                                });
                            } else if(player.getStatus() == DS.PlayerStatus["OnLineStatus"]
                                    && curinfo.player.getStatus() == DS.PlayerStatus["OnLineStatus"]){
                                curinfo.socket.emit('invite', {
                                    type            : "send invitation successfully",
                                    invitedusername : json.otheruser,
                                    room            : json.roomname
                                });
                                player.getSocket().emit('invite', {
                                    type : "you are invited",
                                    host : curinfo.player.getName(),
                                    room : json.roomname
                                });
                                //init room
                                curinfo.player.setStatus(DS.PlayerStatus["HostWaitForGuest"]);
                                player.setStatus(DS.PlayerStatus["GuestWaitForHost"]);
                                var time = parseInt(DS.WaitTime);
                                var timehandle = setInterval(function(){
                                    if(player.getSocket()){
                                        player.getSocket().emit('invite', {
                                            type        : 'timer',
                                            time_left   : time / 1000
                                        });
                                    }
                                    time -= 1000;
                                    if(time < 0){
                                        if(curinfo.player.getStatus() == DS.PlayerStatus["HostWaitForGuest"]){
                                            curinfo.player.setStatus(DS.PlayerStatus["OnLineStatus"]);
                                            curinfo.player.setRoom(null);
                                        }
                                        if(player.getStatus() == DS.PlayerStatus["GuestWaitForHost"]){
                                            player.setStatus(DS.PlayerStatus["OnLineStatus"]);
                                        }
                                        if(player.getSocket()){
                                            player.getSocket().emit('invite', {
                                                type        : 'no time left'
                                            });
                                        }
                                        player.getRoom().clearInvitationTimeHandle();
                                        gamectrset.removeChessRoom(player.getRoom());
                                        player.setRoom(null);
                                    }
                                }, 1000);
                                var room = ChessRoomCtr.newChessRoom();
                                room.setId(curinfo.player.getName() + json.roomname);
                                room.addPlayer(curinfo.player);
                                room.addPlayer(player);
                                room.setHost(curinfo.player);
                                room.setInvitationTimeHandle(timehandle);
                                player.setRoom(room);
                                curinfo.player.setRoom(room);
                                gamectrset.addChessRoom(room);
                            } else {
                                logger.LOG('info', 'invite some else');
                            }
                        }
                    });
                    if(!playerHasFound){
                        curinfo.socket.emit('invite', {
                            type            : "your invited user doesn't exist",
                            invitedusername : json.otheruser
                        });
                    }
                }
            } else if(json.type == 'accept the invitation'){
                var hostplayer = curinfo.player.getRoom().players[0];

                if(hostplayer.getStatus() == DS.PlayerStatus["HostWaitForGuest"]
                        && curinfo.player.getStatus() == DS.PlayerStatus["GuestWaitForHost"]){
                    hostplayer.setStatus(DS.PlayerStatus["GameRunningStatus"]);
                    curinfo.player.setStatus(DS.PlayerStatus["GameRunningStatus"]);
                    hostplayer.getRoom().clearInvitationTimeHandle();
                    
                    hostplayer.getSocket().emit('invite' ,{
                        type : 'start game'
                    });
                    curinfo.player.getSocket().emit('invite', {
                        type : 'start game'
                    });
                    logger.LOG('info', curinfo.player.getName() + " accept the invitation from " +
                            hostplayer.getName() + " to room : " +  curinfo.player.getRoom().getId());
                }
            } else if(json.type == "don't accept the invitation"){
                var hostplayer = curinfo.player.getRoom().players[0];

                if(hostplayer.getStatus() == DS.PlayerStatus["HostWaitForGuest"]){
                    hostplayer.setStatus(DS.PlayerStatus["OnLineStatus"]);
                    hostplayer.setRoom(null);
                }
                if(curinfo.player.getStatus() == DS.PlayerStatus["GuestWaitForHost"]){
                    logger.LOG('info', curinfo.player.getName() + " don't accept the invitation from " +
                            hostplayer.getName() + " to room : " +  curinfo.player.getRoom().getId());

                    curinfo.player.setStatus(DS.PlayerStatus["OnLineStatus"]);
                    curinfo.player.getRoom().clearInvitationTimeHandle();
                    gamectrset.removeChessRoom(curinfo.player.getRoom());
                    curinfo.player.setRoom(null);

                    hostplayer.getSocket().emit('invite' ,{
                        type : "the user don't accept the game"
                    });
                    curinfo.player.getSocket().emit('invite', {
                        type : "stop game"
                    });
                }
            }
        });

        cursocket.on('game', function(){
        });

        cursocket.on('disconnect', function(){
            if(curinfo && curinfo.player){
                logger.LOG('info', 'curplayer disconnect ' + curinfo.player.getName());
                curinfo.player.setStatus(DS.PlayerStatus["OffLineStatus"]);

                broadcastplayers.forEach(function(player){
                    if(player.username == curinfo.player.getName()){
                        player.curstatus = DS.PlayerStatus["OffLineStatus"];
                    }
                });
            }

            logger.LOG('debug', 'gamectrset.players ' + JSON.stringify(broadcastplayers));

            gamectrset.players.forEach(function(player){
                if(player.getSocket()){
                    player.getSocket().emit('system', {
                        type         : 'userlogout',
                        curuser      : player.getName(),
                        allplayers   : broadcastplayers
                    });
                }
            });
        });
    });
}
