const WebServiceClient = require("@maxmind/geoip2-node").WebServiceClient
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();

const privateKey  = fs.readFileSync('/etc/letsencrypt/live/srichel.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/srichel.com/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const SSL_PORT = 443
const PORT = 80

app.get("*", (req, res, next) => { // log all requests
    let ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(":")
    ip = ip[ip.length-1]
    let client = new WebServiceClient("632311", "qx13ZC8CxNdynVSU", {host: "geolite.info"})
    client.city(ip)
    .then(res => {
        let str = new Date().toISOString().slice(0, 16).replace('T', ' ')
        str += " " + ip + " made request to " + (req.originalUrl == "/" ? "RICK ROLLED" : req.originalUrl)
        str += " from " + res.city.names.en + ", " + res.subdivisions[0].isoCode + " " + res.registeredCountry.isoCode
        console.log(str)
    })
    .catch(error => console.log(error))
    .then(next())
})

app.get('/', (req, res) => {
    res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
})

app.post('/booker', (req, res) => {
    obj = req.body['value']
    obj['targetDateTime'] = ((new Date(obj['targetDateTime']).getTime() / 1000) - (4 * 60 * 60)).toString()
    console.log("got booking request")
    console.log(obj)
    let queueJson = fs.readFileSync("public/booker/queue.json","utf-8");
    let requests = JSON.parse(queueJson);
    requests.push(obj);
    queueJson = JSON.stringify(requests);
    fs.writeFileSync("public/booker/queue.json", queueJson, "utf-8");
})

app.use(express.static('public', {dotfiles:'allow'}))
app.use(express.json())

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT);
httpsServer.listen(SSL_PORT);

console.log("http listening on port " + PORT)
console.log("https listiing on port " + SSL_PORT)
