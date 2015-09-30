var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();

app.use(express.static(__dirname+"/views"));

var privateKey = fs.readFileSync('keys/monca.key');
var certificate = fs.readFileSync('keys/monca.crt');
var options = {
	key : privateKey,
	cert : certificate
};

var server = https.createServer(options, app);

server.listen(8000);

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ server : server });
var id = 0;
//var clients = {};
var v:

wss.on('connection', function connection(ws) {
  console.log('connection ' + id + ' établie');
  //clients[id] = connection;
  id++;
  
  ws.on('message', function (message){
    console.log('received: %s', message);
	ws.send('reponse');
  });
});
 
console.log('Server listening on port 8000');

function f() {
	v = setInterval(send, 16);
}

function send() {

}