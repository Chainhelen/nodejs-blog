var DS = {};

//Class Name
DS.ClassType = {
    "PlayerClassType"       :   "ChessPlayer",
    "ChessRoomClassType"    :   "ChessRoom",
    "ControllerClassType"   :   "Controller"
}

//Game running error
DS.GameError = {
    "PlayerExceptionError":               0,
    "AlereadyInTheRoomError":             1,
    "AlereadyInOtherRoomError":           2,
    "EnterTheRoomFailedError":            3,
    "RoomExceptionError":                 4
}

//player state
DS.PlayerState = {
    "OffLineState" :                        1,
    "GameRunningState" :                    2, 
    "PauseGameRunningState" :               3,
    "ExceptionState" :                      4
};

//chess room state
DS.ChessRoomState = {
    "GameRoomPauseState":               0,
    "GameRoomStartState":               1,
    "GameRoomStopState":                2,
    "GameRoomExceptionState":           3
}

module.exports = DS;
