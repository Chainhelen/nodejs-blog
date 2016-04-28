//gamectr class

//init Array class
function ArrayRemove(array, dx) 
{ 
    if(isNaN(dx) || dx > array.length){
        return false;
    }
    array.splice(dx,1); 
}

//require some *.js
var logger       = require('../../log/log4.js');
var PlayerCtr    = require('./playerctr.js');
var ChessRoomCtr = require('./chessroomctr.js');
var DS           = require('./datastruct.js');
var GameCtr      = {};

//game GameCtrSet class
var GameCtrSet = function(){
    this.players = [];
    this.chessrooms = [];
    this.sockets = [];
};

/* name      : GameCtrSet.prototype.getPlayer
 * function  : get player object by playerid
 * parameter : the id of the player
 * return    : player object or null
*/
GameCtrSet.prototype.getPlayer = function (playerid){
    return PlayerCtr.getPlayer(playerid, this.players);
}

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

/* name      : GameCtrSet.prototype.addPlayer
 * function  : GameCtrSet Class add player object to players array
 * parameter : player object that will be added 
 * return    : void
*/
GameCtrSet.prototype.addPlayer = function(player){
    this.players.push(player);
}

/* name      : GameCtrSet.prototype.removePlayer
 * function  : GameCtrSet Class remove player object from players array
 * parameter : the id of player object that will be removed
 * return    : false if failed
 *             true if success
*/
GameCtrSet.prototype.removePlayer = function(playerid){
    for(var i = 0;i < this.players.length;i++){
        if(this.players[i].id == playerid){
            return ArrayRemove(this.players, i);
        }
    }
    return false;
}

/* name      : GameCtrSet.prototype.addChessRoom
 * function  : GameCtrSet Class add chessroom object to chessrooms array
 * parameter : chessroom object that will be added 
 * return    : void
*/
GameCtrSet.prototype.addChessRoom = function(room){
    this.chessrooms.push(room);
}

/* name      : GameCtrSet.prototype.removeChessRoom
 * function  : GameCtrSet Class remove chessroom object from chessrooms array
 * parameter : the id of chessroom object that will be removed 
 * return    : false if failed
 *             true if success
*/
GameCtrSet.prototype.removeChessRoom = function(chessroomid){
    for(var i = 0;i < this.chessrooms.length;i++){
        if(this.chessrooms[i].id == chessroomid){
            return ArrayRemove(this.chessrooms, i);
        }
    }
    return false;
}

/* name      : GameCtrSet.prototype.addSocket
 * function  : GameCtrSet Class add socket object to sockets array
 * parameter : socket object that will be added 
 * return    : void
*/
GameCtrSet.prototype.addSocket = function(socket){
    this.sockets.push(socket);
}

/* name      : GameCtrSet.prototype.removeSocket
 * function  : GameCtrSet Class remove chessroom object from chessrooms array
 * parameter : the id of chessroom object that will be removed 
 * return    : false if failed
 *             true if success
*/
GameCtrSet.prototype.removeSocket = function(socketid){
    for(var i = 0;i < this.sockets.length;i++){
        if(this.sockets[i].id == socketid){
            return ArrayRemove(this.sockets, i);
        }
    }
    return false;
}

GameCtr.newGameCtrSet = function(){
    return new GameCtrSet();
}

module.exports = GameCtr;
