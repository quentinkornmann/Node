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
var snakes = [];
var dxs = [];
var dys = [];
var norms = [];
var lastid = 0, v;

wss.on('connection', function connection(ws){
	console.log('connection ' + lastid + ' établie');
	sockets.push(ws);
	ws.send('init');
	console.log('init envoyé au client ' + lastid);
	lastid++;
	
	ws.on('message', function(msg){
		var norm, res, dx, dy;
		var t = [];
		res = msg.split("/");	// BON
			
		if(res[20] != null && res[21] != null){
			dx = res[20] - res[0];
			dy = res[21] - res[1];
			norm = Math.sqrt(dy * dy + dx * dx);
			res.splice(res.length - 2, 2);
			for(var i = 0 ; i < sockets.length ; i++){
				if(sockets[i] == ws){
					for(j = 0 ; j < res.length ; j++){
						snakes[i][j] = parseFloat(res[j]);
					}
					dxs[i] = dx;
					dy[i] = dy;
					norms[i] = norm;
				}
			}
		}
		else{
			for(var i = 0 ; i < sockets.length ; i++){
				if(sockets[i] == ws){
					snakes[i][0] = parseFloat(res[0]);
					snakes[i][1] = parseFloat(res[1]);
				}
			}
		}
	});
	
	ws.on('close', function(){
		for(var i = 0 ; i < sockets.length ; i++){
			if(sockets[i] == ws){
				console.log('client ' + i + ' déconnecté');
			}
		}
	});
});

f();
function f(){
	v = setInterval(send, 50);
};

function send(){
	var res = "";

	calculer();
	
	for(var i = 0 ; i < snakes.length ; i++){
		for(var j = 0 ; j < snakes[i].length ; j++){
			res += snakes[i][j].toString() + '/';
		}
		res+= "|";
	}
	
	for(var i = 0 ; i < sockets.length ; i++){
		if(sockets[i].readyState == 1){
			sockets[i].send("upda" + res); 
		}
	}
};

function calculer(){
	var x, y;
	for(var i = 0 ; i < snakes.length ; i++){
		x = snakes[i][0];
		x += dx[i] / (norms[i] / 5);
		y = snakes[i][1];
		y += dy[i] / (norms[i] / 5);
		
		if(x <= 0){
			x += 1000;
		}
		if(x >= 1000){
			x -= 1000
		}
			
		if(y <= 0){
			y += 400;
		}				
		if(y >= 400){
			y -= 400;
		}
		
		snakes[i][0] = x;
		snakes[i][1] = y;
	}
}