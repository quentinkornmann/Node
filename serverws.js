var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();

var privateKey = fs.readFileSync('keys/monca.key');
var certificate = fs.readFileSync('keys/monca.crt');
var options = {
	key : privateKey,
	cert : certificate
};

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.setHeader("Content-Type", "text/html");
  res.render(__dirname + 'index');
});

var server = https.createServer(options, app);
server.listen(8000);
console.log('HTTPS server listening on port 8000');

/*https://www.npmjs.com/package/ws*/

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8000 });
console.log('server listening on port 8000');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('reponse_serveur');
});