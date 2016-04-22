var log4js = require('log4js');

log4js.configure({
    appenders:[
        {type:'console'}
    ]
})

exports.logger = function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};
