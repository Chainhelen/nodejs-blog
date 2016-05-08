var path = require('path');
var lsblog = require('../models/lsblog');
var fourzorefour = require('../routes/fourzorefour.js');
var fs = require('fs');
var markdown = require('marked');
var DataBaseBlog = require('../models/blog.js');
var filetype = ['md', 'html', 'local_allfiles'];
var config = require('../config.json');
var adminuser = config.adminuser;
var users = require('../models/user.js');
var logger = require('../log/log4.js').log('blog');

//mark option
markdown.setOptions({
    renderer: new markdown.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

//admin blog浏览
exports.index = function(req, res, next){
	var myPath = 'blog/'+req.params.what;
	var allLocalBlogs = lsblog.FindBlogByName('./views/blog/');

    //empty
    if("undefined" == typeof(req.params.what) || req.params.what == "index"){
		lsblog.FindDatabaseBlogByAuthor("chainhelen", function(databaseBlogs){
			var numOfAllFiles = 0;
			var warring = "";
			for(var i = 0;i < databaseBlogs.length;i++){
				if("local_allfiles" == databaseBlogs[i]){
					numOfAllFiles++;
				}
			}
			if(numOfAllFiles != allLocalBlogs.length){
				warring = "warring numOfAllFiles != allLocalBlogs.length\n";
			}
            logger.LOG("debug", "req.session.user " + JSON.stringify(req.session.user), null, null);

	        res.render('blog/index', {
				firstshow : true,
				username : "chainhelen",
   	        	blogitems : databaseBlogs,
				warrings : warring,
                haslogin : ((req.session.user && req.session.user.username == "chainhelen")? "chainhelen" : null)
        	});
		});
    }else{ // data
		var info = {
			"title" : req.params.what,
			"author": "chainhelen"
		}
		DataBaseBlog.findALLByTitleAndAuthor(info, function(err, obj){
			if(err || 0 == obj.length){
				fourzorefour.one(req, res);
				return ;
			}
			if("md" == obj[0].type){
				var html = markdown(obj[0]["content"]);
				//add hightLightFoot.html
				var hightLightFoot = fs.readFileSync('./views/blog/models/HightLightFoot.html');
				html += hightLightFoot;

				res.send(html);
				res.end();

				return ;
			}
			if("html" == obj[0].type){
				res.send(obj[0]["content"]);
				res.end();
				return ;
			}
			if("local_allfiles" == obj[0].type){
				for(var i in allLocalBlogs){
					if(req.params.what == allLocalBlogs[i]["title"]){
						if("md" == allLocalBlogs[i]["type"]){
							var html = markdown(fs.readFileSync('./views/blog/' + allLocalBlogs[i]["title"] +"." + allLocalBlogs[i]["type"], 'utf8'));
							res.send(html);
							res.end();
							return ;
		
						}
						if("html" == allLocalBlogs[i]["type"]){
							res.render(path.normalize(myPath));
							return ;
						}
	    	    	}
		    	}
			}
		});
	}
}

//普通user 浏览其blog_index
exports.user_blog_index = function(req, res, next){
	users.findByName(req.params.user, function(err, obj){
		//用户不存在
		if(err || null == obj){
			next();
			return ;
		}
		//用户存在 查找其文章
		DataBaseBlog.findALLByAuthor(req.params.user, function(err, obj){
			var result = [];
			var warrings = "";
			for(i in obj){
				result.push(obj[i]);
			}
            logger.LOG("debug", "user_blog_index req.session.user " + JSON.stringify(req.session.user), null, null);

			res.render('blog/index',{
				username : req.params.user,
				blogitems : result,
				warrings : warrings,
                haslogin : (req.session.user.username == req.params.user ? req.params.user : null)
   	    	});
		});
	})
}

//普通user 浏览其文章
exports.user_blog_article = function(req, res, next){
	var info = {
		"title" : req.params.article, 
		"author" : req.params.user
	}
	DataBaseBlog.findALLByTitleAndAuthor(info, function(err, obj){
		if(err || 0 == obj.length){
			next();
			return;
		}
		if("md" == obj[0].type){
			var html = markdown(obj[0]["content"]);
			//add hightLightFoot.html
			var hightLightFoot = fs.readFileSync('./views/blog/models/HightLightFoot.html');
			html += hightLightFoot;

			res.send(html);
			res.end();
			return ;
		}
		if("html" == obj[0].type){
			res.send(obj[0]["content"]);
			res.end();
			return ;
		}
	});
}

exports.admin = function(req, res, next){
	res.render('blog/models/admin_blog',{
		filetype: filetype
	});
}

exports.blog_fix_status = function(req, res, next){
	users.findByName(res.locals.user.username, function(err, obj){
		//用户不存在
		if(err || null == obj){
			next();
			return ;
		}
		//用户存在 查找其文章
		DataBaseBlog.findALLByAuthor(res.locals.user.username, function(err, obj){
			var result = [];
			var warrings = "";
			for(i in obj){
				obj[i].escapetitle = escape(obj[i].title);
				result.push(obj[i]);
			}
            logger.LOG("debug", "blog_fix_status res.locals.user.username " + res.locals.user.username, null, null);

			res.render('blog/index',{
				username : res.locals.user.username,
				blogitems : result,
				warrings : warrings,
				fix : true
   	    	});
		});
	})
};

exports.admin_get = function(req, res, next){
	res.render('blog/models/admin_blog',{
		filetype: filetype,
		author: res.locals.user.username
	});
}

//当前登录的人可以add, update操作
exports.admin_post = function(req, res, next){
	var info = {
			"title" : req.body.title, 
			"author" : res.locals.user.username
	};
	DataBaseBlog.findALLByTitleAndAuthor(info, function(err, obj){
		if(undefined == req.body.type || !isExit(req.body.type, filetype)){
			res.render('blog/models/saveOrUpdateBlogInfo.html', {
				info				: "no filetype",
				currentIsAdminUser	: isExit(res.locals.user.username, adminuser),
				username			: res.locals.user.username,
				title 				: req.body.title,
				escapetitle			: escape(req.body.title)
			})
			res.end();
			return ;
		}
		//save
		if(err || 0 == obj.length){
			DataBaseBlog.saveDocs(req , function(err){
				if(err){
					res.render('blog/models/saveOrUpdateBlogInfo.html', {
						info				: "save failed",
						currentIsAdminUser	: isExit(res.locals.user.username, adminuser),
						username			: res.locals.user.username,
						title 				: req.body.title,
						escapetitle			: escape(req.body.title)
					});
					res.end();
				}else{
					res.render('blog/models/saveOrUpdateBlogInfo.html', {
						info				: "save sucessed",
						currentIsAdminUser	: isExit(res.locals.user.username, adminuser),
						username			: res.locals.user.username,
						title 				: req.body.title,
						escapetitle			: escape(req.body.title)
					})
					res.end();
				}
				return ;
			});
		}else{ // update
			DataBaseBlog.updateByTitle(req.body.title, req.body.content, function(err, number, raw){
				if(err){
					res.render('blog/models/saveOrUpdateBlogInfo.html', {
						info				: "update failed",
						currentIsAdminUser	: isExit(res.locals.user.username, adminuser),
						username			: res.locals.user.username,
						title 				: req.body.title,
						escapetitle			: escape(req.body.title)
					})
					res.end();
				}else{
					res.render('blog/models/saveOrUpdateBlogInfo.html', {
						info				: "update sucessed",
						currentIsAdminUser	: isExit(res.locals.user.username, adminuser),
						username			: res.locals.user.username,
						title 				: req.body.title,
						escapetitle			: escape(req.body.title)
					})
					res.end();
				}
				return ;
			});
		}
	});
}

//only the author can fixed the articles which he write by himself
exports.json = function(req, res, next){
	var info = {
			"title" : req.body.title, 
			"author" : res.locals.user.username
	};
	DataBaseBlog.findALLByTitleAndAuthor(info, function(err, obj){
		if(obj){
			res.json(obj[0]);
		}else{
			res.json({});
		}
	});
}
exports.blog_delete = function(req, res, next){
	var info = {
		"title" : req.body.title,
		"author" : res.locals.user.username
	};
	DataBaseBlog.removeByTitleAndAuthor(info, function(err){
		if(err){
			res.json({"error":err});
		}else{
			res.json({});
		}
	});
}

function isExit(elment, arr){
	if("undefined" == typeof(arr)){
		return false;
	}
	var len = arr.length;
	for(var i = 0;i < len;i++){
		if(elment == arr[i]){
			return true;
		}
	}
	return false;
}
