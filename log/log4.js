var log4js = require('log4js');

log4js.configure({
    appenders:[
    {type:'console'}
    ]
});

// the level of log, if not setting in list, it will be set "info"
var loglevel = {
    'chessgame' : 'debug',
    'chat'      : 'debug',
    'mongoose'  : 'info'
};

//log function 
exports.log = function(name){
    var logger = log4js.getLogger(name);
    if(loglevel[name]){
        logger.setLevel(loglevel[name]);
    } else {
        logger.setLevel("info");
    }
    logger.LOG = function (LogSwitch, showstring, callback, callbackparameter){
        if(null != showstring){
            if("trace" == LogSwitch){
                logger.trace(showstring);
            } else if("debug" == LogSwitch){
                logger.debug(showstring);
            } else if("info" == LogSwitch){
                logger.info(showstring);
            } else if("warn" == LogSwitch){
                logger.warn(showstring);
            } else if("error" == LogSwitch){
                logger.error(showstring);
            } else if("fatal" == LogSwitch){
                logger.fatal(showstring);
            }
        }
        if(null == callbackparameter || null != callback){
            return;
        }
        callback(callbackparameter);
    };
    return logger;
};
