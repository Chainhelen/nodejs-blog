var fs = require('fs');
var path = require('path');
var DataBaseBlog = require('../models/blog.js');

exports.FindBlogByName = function(fp){
    var files = fs.readdirSync(fp);
    var res = [];
    for(fn in files){
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
