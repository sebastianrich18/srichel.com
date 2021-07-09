var express = require('express');
var app = express();
var fs = require('fs');
let path = process.cwd()
var http = require('http');
var dice = require('./dice.js')
let io = require('socket.io')(httpServer, {});
//var https = require('https');
//var privateKey  = fs.readFileSync('/etc/letsencrypt/live/www.srichel.com/privkey.pem', 'utf8');
//var certificate = fs.readFileSync('/etc/letsencrypt/live/www.srichel.com/cert.pem', 'utf8');

//var credentials = {key: privateKey, cert: certificate};
app.get('/', (req, res) => {
    res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
})
app.use(express.static('public'))

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
//httpsServer.listen(443);
