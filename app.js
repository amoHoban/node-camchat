
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
time = new Date().getTime(); 

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



var server = http.createServer(app);

var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.configure(function () { 

});

io.sockets.on('connection', function (client) {
  // Index
  client.on('set nickname', function (nick) {
    client.nickname = nick;
      io.sockets.emit("newUser",nick);
      return true;
  
  });
  
  io.sockets.json.send(msgs);
  client.on('message', function (data) {
    if (data.length > 2 ) {
    msg = client.nickname +" says " + escapeHTML(data);
   // msgs.push(msg);
    io.sockets.send(msg);
    }
  });
  client.on('webcam', function (data) {
    if ((new Date().getTime() - time) >= 250);
      time = new Date().getTime();
     client.broadcast.emit('webcam',{'img':data});
  }); 
 client.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});

app.get("/",routes.index);
app.post("/",function(req, res){
  if (!checkClientNickName(req.param("nickname",""))) {
      //req.flash('error','Please use a valid nickname');
      res.render("login", {"title":index.title});
  }
  else {
    res.render("index",{"title":index.title,"nickname":req.param("nickname")});
  }
});
app.get("/test",routes.test);


function checkClientNickName(strVal){
  if (strVal == null) return false;
  return strVal.length > 3;
}

function escapeHTML(strVal) {
  strVal = strVal.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return strVal;
}