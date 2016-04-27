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
