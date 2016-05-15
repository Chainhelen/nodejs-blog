var ChessRoomCtr = {};

//room class
var ChessRoom = function (id){
    this.id = null;
    this.players = [];
    this.observers = [];
    this.host = null;
    this.invitationtimehandle = null;
};

ChessRoom.prototype.setInvitationTimeHandle = function(invitationtimehandle){
    this.invitationtimehandle = invitationtimehandle;
};

ChessRoom.prototype.clearInvitationTimeHandle = function(){
    clearInterval(this.invitationtimehandle);
    this.invitationtimehandle = null;
}

ChessRoom.prototype.getId = function(){
    return this.id;
}
ChessRoom.prototype.setId = function (id){
    this.id = id;
}

ChessRoom.prototype.addPlayer = function(player){
    this.players.push(player);
}

ChessRoom.prototype.removePlayerByName = function(playername){
    for(var i = 0;i < this.players.length;i++){
        if(this.players[i].getName() == playername){
            this.players.splice(i, 1);
            return;
        }
    }
}

ChessRoom.prototype.addObservers = function(observer){
    this.observers.push(observer);
}

ChessRoom.prototype.removeObserverByName = function(observername){
    for(var i = 0;i < this.observers.length;i++){
        if(this.observers[i].getName() == observername){
            this.observers.splice(i, 1);
            return;
        }
    }
}

ChessRoom.prototype.setHost = function(host){
    this.host = host;
}

ChessRoom.prototype.getHost = function(){
    return this.host;
}

/* name      : ChessRoomCtr.newChessRoom
 * function  : create a new chessroom
 * parameter : void
 * return    : chessroom
*/
ChessRoomCtr.newChessRoom = function(){
    return new ChessRoom();
}

module.exports = ChessRoomCtr;
