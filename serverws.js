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
var sockets = [], snakes = [], dxs = [], dys = [], norms = [];
var v, lastid = 0;

wss.on('connection', function connection(ws){
	sockets[lastid] = ws;
	console.log('connection ' + lastid + ' établie');
	sockets[lastid].send('init');	// envoi de la commande init au client pour qu'il créée les 10 cercles
	console.log('init envoyé au client ' + lastid);
	lastid++;
	
	ws.on('message', function(msg){
		var res = [], t = [];
		res = msg.split("/");

		for(var i = 0 ; i < sockets.length ; i++){
			if(sockets[i] == ws){
				if(res[20] != null && res[21] != null){
					var dx, dy, norm;
					dx = res[20] - res[0];
					dy = res[21] - res[1];
					norm = Math.sqrt(dy * dy + dx * dx);
					res.splice(res.length - 2, 2);
					
					for(var i = 0 ; i < sockets.length ; i++){
						if(sockets[i] == ws){
							for(j = 0 ; j < res.length ; j++){
								t[j] = parseFloat(res[j]);
							}
							dxs[i] = dx;
							dys[i] = dy;
							norms[i] = norm;
							snakes[i] = t;
						}
					}
				}
				else{
					for(var i = 0 ; i < sockets.length ; i++){
						if(sockets[i] == ws){
							for(j = 0 ; j < res.length ; j++){
								t[j] = parseFloat(res[j]);
							}
							snakes[i] = t;
						}
					}				
				}
			}
		}
	});
	
	ws.on('close', function(){
		for(var i = 0 ; i < sockets.length ; i++){
			if(sockets[i] == ws){
				console.log('client ' + i + ' déconnecté');
				dxs[i] = null;
				dys[i] = null;
				norms[i] = null;
				snakes[i] = null;
			}
		}
	});
});

f();
function f(){
	v = setInterval(send, 50);
};

function send(){
	res = "";

	calculer();
	
	for(var i = 0 ; i < snakes.length ; i++){	// cette boucle transforme le tableau de tous les snakes en string pour l'envoyer à tous les joueurs
		if(snakes[i] != null){					// chaque serpent est délimité par un |, chaque float qui représente une position est séparé par un /
			for(var j = 0 ; j < snakes[i].length ; j++){
				res += snakes[i][j].toString();
				if(j+1 != snakes[i].length){
					res += '/';
				}
			}
			if(i+1 != snakes.length){
				res+= "|";
			}
		}
	}
	
	for(var i = 0 ; i < sockets.length ; i++){	// broadcast du string contenant toutes les positions à tous les clients
		if(sockets[i].readyState == 1){
			if(res != null){
				sockets[i].send("upda" + i + res); // envoi de la commande update au client
			}
		}
	}
};

function calculer(){
	var x, y;
	for(var i = 0 ; i < snakes.length ; i++){
		if(snakes[i] != null)
		{
			for(var j = 0 ; j < 20 ; j += 2)
			{
				x = snakes[i][j];
				y = snakes[i][j+1];
				
				if(dxs[i] != null && dys[i] != null && norms[i] != null){
					x += dxs[i] / (norms[i] / 5);
					y += dys[i] / (norms[i] / 5);
				}
				
				if(x <= 0){
					x += 1000;
				}
				if(x >= 1000){
					x -= 1000;
				}
					
				if(y <= 0){
					y += 400;
				}				
				if(y >= 400){
					y -= 400;
				}
				
				snakes[i][j] = x;
				snakes[i][j+1] = y;
			}
		}
	}
}
