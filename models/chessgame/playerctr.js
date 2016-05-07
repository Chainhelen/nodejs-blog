var DS = require('./datastruct.js');
 
var PlayerCtr = {};

//play class
var ChessPlayer = function (){
    this.name = null;
    this.room = null;
    this.status = DS.PlayerStatus["OffLineStatus"];
    this.socket = null;
};

//the get/set function of ChessPlayer class 
ChessPlayer.prototype.getName = function(){
    return this.name;
}
ChessPlayer.prototype.setName = function(name){
    this.name = name;
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
PlayerCtr.getPlayer = function(playername, players) {
    for(var player in this.players){
        if(player.name == playername){
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
