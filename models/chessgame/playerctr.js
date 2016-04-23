var DS = require('./datastruct.js');

var PlayerCtr = {};

//play class
var ChessPlayer = function (id){
    this.id = id;
    this.room = {};
    this.state = DS.PlayerState["offline"];
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


module.exports = PlayerCtr;
