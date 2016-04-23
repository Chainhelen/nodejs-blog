var log4js = require('log4js');

log4js.configure({
    appenders:[
    {type:'console'}
    ]
});

//log function 
exports.logger = function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    logger.LOG = function LOG(LogSwitch, showstring, callback, callbackparameter){
        if(null != showstring){
            if("trace" == LogSwitch){
                logger.trace(showstring);
            } else if("debug" == LogSwitch){
                logger.Debug(showstring);
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
