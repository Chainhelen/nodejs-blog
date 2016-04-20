
//错误类型
var PlayerModelError = {
    "AccountException":              0,
    "AlereadyInTheRoom":             1,
    "AlereadyInOtherRoom":           2,
    "OffLine":                       3
}

//玩家模型
var PlayerState = {
    "OffLine" :             1,
    "GameRunning" :         2, 
    "PauseGameRunning" :    3,
    "Exception" :           4
};

var ChessPlayer = function (id){
    this.id = id;
    this.room = {};
    this.state = PlayerState["offline"];
};

ChessPlayer.prototype.setRoom = function (room) {
    if("ChessRoom" != room){
        return false;
    }
    this.room = room;
    return true;
}

//房间模型
var ChessRoom = function (){};

//游戏控制器
var Controler = function() {};
Controler.prototype.getPlayer = function (roomId){
}

//
/*
export.initStartGame = function(io) {
    io.of('/chessgame').on('connection', function(socket){
    })
}*/
