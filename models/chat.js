exports.simple_chat = function(io) {
	io.of('/chat').on('connection', function(socket) {
		socket.emit('open');

		var client = {
			socket: socket,
			name: false,
			color: getColor()
		}

		socket.on('message', function(msg) {
			var obj = {
				time: getTime(),
				color: client.color
			};

			if (!client.name) {
				client.name = msg;
				obj['text'] = client.name;
				obj['author'] = 'System';
				obj['type'] = 'welcome';
				console.log(client.name + ' login');

				socket.emit('system', obj);
				socket.broadcast.emit('system', obj);
			} else {

				obj['text'] = msg;
				obj['author'] = client.name;
				obj['type'] = 'message';
				console.log(client.name + ' say: ' + msg);

				socket.emit('message', obj);
				socket.broadcast.emit('message', obj);
			}
		});

		socket.on('disconnect', function() {
			var obj = {
				time: getTime(),
				color: client.color,
				author: 'System',
				text: client.name,
				type: 'disconnect'
			};

			socket.broadcast.emit('system', obj);
			console.log(client.name + 'Disconnect');
		});
	});
}
var getTime=function(){
  var date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

var getColor=function(){
  var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
                'orange','blue','blueviolet','brown','burlywood','cadetblue'];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
}
