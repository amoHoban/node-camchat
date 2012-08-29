
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , utils = require('./utils.js')


msgs = utils.FixedQueue(50,[]);
msg ="";
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret  23 here'));
  app.use(express.session());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));

});
app.configure('development', function(){
  app.use(express.errorHandler());
});

index = [];
index.title = "My little ugly node.js chat";

app.get('/', routes.index);
// Index

app.get("/test",routes.test);

var server = http.createServer(app);

var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 2); 
});

io.sockets.on('connection', function (client) {
  io.sockets.json.send(msgs);
  client.on('message', function (data) {
    if (data.length > 2 ) {
    msg = escapeHTML(data);
    msgs.push(msg);
    io.sockets.send(msg);
    }
  });
  client.on('webcam', function (data) {
     client.broadcast.emit('webcam',{'img':data});
  }); 
 
});

function escapeHTML(strVal) {
  console.log( strVal );
  strVal = strVal.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  console.log( strVal );
  return strVal;
}