
//debug function 
function DEBUG_FUNCTION(DebugSwitch, showstring, callback, callbackparameter){
    if(!DebugSwitch){
        return;
    }
    console.log(showstring);
    if(null == callbackparameter || null != callback){
        return;
    }
    callback(callbackparameter);
}

//错误类型
var PlayerModelError = {
    "AccountException":              0,
    "AlereadyInTheRoom":             1,
    "AlereadyInOtherRoom":           2,
    "OffLine":                       3
}

//wan jia zhuangtai
var PlayerState = {
    "OffLine" :             1,
    "GameRunning" :         2, 
    "PauseGameRunning" :    3,
    "Exception" :           4
};

//Class Name
var ClassType = {
    "PlayerClassType"       :   "ChessPlayer",
    "ChessRoomClassType"    :   "ChessRoom",
    "ControllerClassType"   :   "Controller"
}

//玩家class
var ChessPlayer = function (id){
    this.id = id;
    this.room = {};
    this.state = PlayerState["offline"];
};

ChessPlayer.prototype.setRoom = function (room) {
    if(ClassType["ChessRoomClassTypeString"] != typeof(room)){
        return false;
    }
    this.room = room;
    return true;
}

//房间模型
var ChessRoom = function (){};

//游戏控制器
var Controller = function() {};
Controller.prototype.getPlayer = function (roomId){
}

//
/*
export.initStartGame = function(io) {
    io.of('/chessgame').on('connection', function(socket){
    })
}*/
