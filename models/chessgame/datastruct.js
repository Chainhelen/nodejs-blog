var DS = {};

//Class Name
DS.ClassType = {
    "PlayerClassType"       :   "ChessPlayer",
    "ChessRoomClassType"    :   "ChessRoom",
    "ControllerClassType"   :   "Controller",
    "AuthClassType"         :   "AuthClass"
}

//Game running error
DS.GameError = {
    "PlayerExceptionError":               0,
    "AlereadyInTheRoomError":             1,
    "AlereadyInOtherRoomError":           2,
    "EnterTheRoomFailedError":            3,
    "RoomExceptionError":                 4
}

DS.GameStatus = {
} 

//player status
DS.PlayerStatus = {
    "OffLineStatus" :                        1,
    "GameRunningStatus" :                    2, 
    "PauseGameRunningStatus" :               3,
    "ExceptionStatus" :                      4
};

//chess room status
DS.ChessRoomStatus = {
    "GameRoomPauseStatus":               0,
    "GameRoomStartStatus":               1,
    "GameRoomStopStatus":                2,
    "GameRoomExceptionStatus":           3
}


/*
DS.Auth = {
    "id" : null 
}*/

module.exports = DS;
