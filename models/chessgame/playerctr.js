var DS = require('./datastruct.js');
 
var PlayerCtr = {};

//play class
var ChessPlayer = function (){
    this.id = null;
    this.room = null;
    this.status = DS.PlayerStatus["offline"];
    this.socket = null;
};

//the get/set function of ChessPlayer class 
ChessPlayer.prototype.getId = function(){
    return this.id;
}
ChessPlayer.prototype.setId = function(id){
    this.id = id;
}
ChessPlayer.prototype.getRoom = function(){
    return this.room;
}
ChessPlayer.prototype.setRoom = function(room){
    this.room = room;
}
ChessPlayer.prototype.getStatus = function(){
    return this.status;
}
ChessPlayer.prototype.setStatus = function(status){
    this.status = status;
}
ChessPlayer.prototype.getSocket = function(){
    return this.socket;
}
ChessPlayer.prototype.setSocket = function(socket){
    this.socket = socket;
}

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

/* name      : PlayerCtr.newPlayer
 * function  : create a new player
 * parameter : void
 * return    : player object
*/
PlayerCtr.newPlayer = function() {
    return new ChessPlayer();
}

module.exports = PlayerCtr;
