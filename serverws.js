var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();
var port = 8000;

app.use(express.static(__dirname+"/views"));

var privateKey = fs.readFileSync('keys/monca.key');
var certificate = fs.readFileSync('keys/monca.crt');
var options = {
	key : privateKey,
	cert : certificate
};

var server = https.createServer(options, app);

server.listen(port);
console.log('Server listening on port ' + port);

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ server : server });
var sockets = [];
var lastid = 0, v, dx, dy, res, norm;

wss.on('connection', function connection(ws) {
	console.log('connection ' + lastid + ' établie');
	sockets.push(ws);
	ws.send('init');
	console.log('init sent ' + lastid);
	lastid++;
	f();
	
	ws.on('message', function(msg){

		res = msg.split("/");
		dx = res[2] - res[0];
		dy = res[3] - res[1];
		norm = Math.sqrt((res[3] - res[1]) * (res[3] - res[1]) + (res[2] - res[0]) * (res[2] - res[0]));
		res.splice(res.length - 2, 2);
		console.log('dx : ' + dx);
		console.log('dy : ' + dy);		
	});
	
	ws.on('close', function(){
		for(var i = 0 ; i < sockets.length ; i++){
			if(sockets[i] == ws){
				sockets.splice(i, 1);
				console.log('client ' + i + ' déconnecté');
			}
		}
	});
});

function f() {
	v = setInterval(send, 50);
};
	
function send() {
	var x, y;
	if(res != null){
		x = parseFloat(res[0]);
		x += dx / (norm / 5);
		res[0] = x.toString();
		y = parseFloat(res[1]);
		y += dy / (norm / 5);
		res[1] = y.toString();
		
		sockets[lastid - 1].send("upda" + res.toString());
	}
};	