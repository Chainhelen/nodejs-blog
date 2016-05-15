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
    "ExceptionStatus" :                      2,
    "OnLineStatus"  :                        3,
    "HostWaitForGuest":                      4,
    "GuestWaitForHost":                      5,
    "GameRunningStatus" :                    6, 
    "PauseGameRunningStatus" :               7
};

//chess room status
DS.ChessRoomStatus = {
    "GameRoomPauseStatus":               0,
    "GameRoomStartStatus":               1,
    "GameRoomStopStatus":                2,
    "GameRoomExceptionStatus":           3
}

//ms
// or DS.WaitTime = 30000;
DS.WaitTime = "30000ms";

/*
DS.Auth = {
    "id" : null 
}*/

module.exports = DS;
