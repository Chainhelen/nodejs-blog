var fs = require('fs');
var path = require('path');
var DataBaseBlog = require('../models/blog.js');
var logger       = require('../log/log4.js').log('blog');

exports.FindBlogByName = function(fp){
    var files = fs.readdirSync(fp);
    var res = [];

    logger.LOG('debug', 'files : ', null, null);
    logger.LOG('debug', files, null, null);
    logger.LOG('debug', 'the num of files is ' + files.length, null, null);

    for(fn in files){
        logger.LOG('debug', 'fn : ' + fn, null, null);

        var fname = fp+path.sep+files[fn];
        var stat = fs.lstatSync(fname);
        if(stat.isDirectory() == true){
        }
        else{
            if(files[fn].split('.')[0] != "index")
                res.push({
					"title" : files[fn].split('.')[0],
					"type" : files[fn].split('.')[1]
				});
        }
    }
    return res;
}

exports.FindDatabaseBlogByAuthor = function(author, callback){
		var result = [];
		DataBaseBlog.findALLByAuthor(author, function(err, obj){
			if(err || [] == obj){
				result = [];
			}else{
				for(i in obj){
					result.push(obj[i]);
				}
			}
			callback(result);
		});
}
