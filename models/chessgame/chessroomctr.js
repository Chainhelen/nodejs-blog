var ChessRoomCtr = {};

//room class
var ChessRoom = function (id){
    this.id = null;
    this.player = [];
    this.observer = [];
    this.host = null;
};

/* name      : ChessRoomCtr.newChessRoom
 * function  : create a new chessroom
 * parameter : void
 * return    : chessroom
*/
ChessRoomCtr.newChessRoom = function(){
    return new ChessRoom();
}

module.exports = ChessRoomCtr;
