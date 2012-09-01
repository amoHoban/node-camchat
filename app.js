
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , utils = require('./utils.js')
  , partials = require('express-partials')
  , messages = require('./messages');


msgs = utils.FixedQueue(50,[]);
msg ="";
var app = express();
time = new Date().getTime(); 

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
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


var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.configure(function () { 

});
//use namespaces
var chat = io
.of('/chat').on('connection', function (client) {
  // Index
  client.lastMessageTime = 0;
  client.on('set nickname', function (nick) {
    client.nickname = nick;
      chat.emit("newUser",nick);
      return true;
  
  });
  
  //client.send(msgs);
  client.on('message', function (data) {
    if (checkMessageLength(data) && floodCheck(this)) {  
      client.lastMessageTime = new Date().getTime();
    msg = '<span class="nick">'
          + client.nickname 
          + '</span>'
          + "<strong>:</strong>" 
          + escapeHTML(data);
   // msgs.push(msg);
    chat.emit('message',{'text':msg, 'time':client.lastMessageTime});
    }
  });
 
 client.on('disconnect', function () {
    chat.emit('user disconnected',client.nickname);
  });
});

var cam = io
.of('/cam').on('connection',function(camclient){
   camclient.on('webcam', function (data) {
     camclient.broadcast.send('webcam',{'img':data});
  });
  camclient.on('disconnect', function () {
     camclient.broadcast.emit('cam disconnected');
  });  
});
app.get("/login", routes.login);
app.get("/",routes.index);
app.post("/",function(req, res){
  if (!checkClientNickName(req.param("nickname",""))) {
      //req.flash('error','Please use a valid nickname');
      res.render("login", {"title":messages.index.title});
  }
  else {
    res.render("index",{"title":messages.index.title,"nickname":req.param("nickname")});
  }
});
app.get("/test",routes.test);
app.get("*",routes.error404);

function checkClientNickName(strVal){
  if (strVal == null) return false;
  return strVal.length > 3;
}

function escapeHTML(strVal) {
  strVal = strVal.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return strVal;
}

function checkMessageLength(m){
  if (m.length < 2 || m.length > 255)
    return false;
  return true;
}

function floodCheck(c){
  if (!c || c<=0) return true;
    if ((new Date().getTime() - c.lastMessageTime) > 500){
        c.lastMessageTime = new Date().getTime();
        return true;
    }
    c.lastMessageTime = new Date().getTime();
    return false;
}