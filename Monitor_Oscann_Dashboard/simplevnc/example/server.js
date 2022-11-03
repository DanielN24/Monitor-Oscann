var http = require('http');
var express = require('express');
var svnc = require('../index.js');
var fs = require("fs");
const cron = require("node-cron");
const cors = require('cors');
const cookieParser = require('cookie-parser');

/* serve your app */
var app = express();

var httpServer = http.createServer(app);
app.use(cors())
app.use(cookieParser())
app.use(express.static(__dirname + '/static/'));
httpServer.listen(8080);
console.log('Listening on port', 8080);	


app.post('/api/:host/:port', (req,res)=>{
  res.cookie("host", req.params.host)
  const response = [req.params.host, req.params.port]
  var params_string = JSON.stringify(response);
  fs.writeFileSync("example/params.json", params_string);
  res.send(response)
})

var exec = require('child_process').exec;

cron.schedule("*/10 * * * * *", () => {
  var exec_client = exec('npm run-script example');
  exec_client.stdout.on('data', function (data) {
    console.log('' + data);
  });
});


/* fire up simplevnc server */
var server = new svnc.Server(httpServer);
server.on('connect', function(client){
  console.log('svnc client connected');
})
server.on('disconnect', function(client){
  console.log('svnc client disconnected');
})
server.on('error', function(err){
  console.error('svnc error', err)
})
