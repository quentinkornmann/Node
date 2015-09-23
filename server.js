var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();

var options = {
  key: fs.readFileSync('keys/monca.key'),
  cert: fs.readFileSync('keys/monca.crt')
};

/*require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);*/

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);

/*var server = app.listen(3000, function () {
  console.log("Express is running on port 3000");
});*/