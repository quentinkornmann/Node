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
var id = 0;
var sockets = [];
var v;

wss.on('connection', function connection(ws) {
	console.log('connection ' + id + ' établie');
	sockets[id] = ws;
	ws.send('init');
	console.log('init sent ' + id);
	id++;
	
	ws.on('message', function(e){
		// traitement requête client
	});
	
	ws.on('close', function(){
		for(var i = 0 ; i < sockets.length ; i++){
			if(sockets[i] = ws){
				sockets.splice(i, 1);
			}
		}
	});
});

f();
function f() {
	v = setInterval(send, 2000);
};

function send() {
	var msg = 'test';
	
	for(var i = 0 ; i < sockets.length ; i++)
	{
		if(sockets[i] != null)
		{
			sockets[i].send(msg);
			console.log(msg + ' sent');
		}
	}
};	