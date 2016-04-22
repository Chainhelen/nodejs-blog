exports.downloads = function(req, res, next){
	var filename = req.params.filename
	  , path = './source/' + filename;
	res.download(path,function(err){
		if(err){
			console.log(path);
			console.log('download err');
			next();
		} else {
			console.log(path);
			console.log('ok\n');
		}
	});	
}
exports.err = function(req, res){
/*	res.set({
		encoding : 'utf-8'
	});
*/
	res.status(404);
	res.send("<h1>what you find 找不到了</h1>");
	res.end();
}
