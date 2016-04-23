var logger       = require('../../log/log4.js')
var PlayerCtr    = require('./playerctr.js')
var ChessRoomCtr = require('./chessroomctr.js')

//game controller class
var Controller = function(){
    this.players = [];
    this.chessrooms = [];
};

/* name      : Controller.prototype.getPlayer
 * function  : get player object by playerid
 * parameter : the id of the player
 * return    : player object or null
*/
Controller.prototype.getPlayer = function (playerid){
    return PlayerCtr.getPlayer(playerid, this.players);
}

/* name      : Controller.prototype.EnterRoom
 * function  : player enter game room
 * parameter : player is  player object
               roomr is  roomId object
 * return    : true or false
*/
Controller.prototype.PlayerEnterRoomById = function (player, room) {
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
    if(ClassType["ChessRoomClassType"] != player.constructor){
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
    if(ClassType["PlayerClassType"] != room.constructor){
        logger.LOG("error", "Error Player Enter Room failed: the constructor room is " + 
                constructor(room), null, null);
        return false;
    } 
    
    ClassType["ChessRoomClassTypeString"] != typeof(room)
    logger.LOG("info", "player " + this.id + " set " + " the room " + room.id + " success" , null, null);
    return true;
}

//
/*
export.initStartGame = function(io) {
    io.of('/chessgame').on('connection', function(socket){
    })
}
*/
