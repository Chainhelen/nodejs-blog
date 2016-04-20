var captchapng = require('captchapng');

exports.index = function(req, res){
	var num = parseInt(Math.random()*9000+1000);
    var p = new captchapng(80, 30, num); 
    p.color(0, 0, 0, 0);  
    p.color(80, 80, 80, 255); 
 
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');

	req.session.ccap = num;
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}
