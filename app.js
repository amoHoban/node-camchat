
/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals')
  , url  = require('url')
  , msgResolver = require('./messages').resolveMessages
  , routes = require('./routes')
  , messages = require('./conf/messages')
  , chatutils = require('./chatutils');
 // , utils = require('./utils');

msg ="";
var app = express();
time = new Date().getTime(); 

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.engine('ejs', engine);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());   
  app.use(express.static(__dirname + '/public'));
  app.use(msgResolver);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser('your secret  23 here'));
  app.use(express.session({ key: 'sid', cookie: { maxAge: 60000 }})); 
  //middleware add session to templates
  app.use(function(req,res,next){
  res.locals.session = req.session;
  next();});
  app.use(express.methodOverride());
  app.use(app.router);
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

app.get("/login", routes.login);

app.post("/chat",function(req, res){
  for (param in req.param){
    console.log(param + " " +req.params(param));
  }

  if (!chatutils.checkClientNickName(req.param("nickname",""))) {
    res.render("login",{"error":"Use a valid nickname"});
  }
  else {
    res.render("chat",{"nickname":req.param("nickname")});
  }
});

app.get("/",routes.login);
app.get("/chat",routes.login)
app.get("/test",routes.test);
app.get("*",routes.error404);
app.get("/room/create/:id",function(req,res){
  id = req.param("id",null);
    if (!id) res.render("index",{error:messages.default.generalError});

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
  
  client.on('message', function (data) {
    if (chatutils.checkMessageLength(data) && chatutils.floodCheck(this)) {  
      client.lastMessageTime = new Date().getTime();
    msg = '<span class="nick">'
          + client.nickname 
          + '</span>'
          + "<strong>:</strong>" 
          + chatutils.chatfilters(chatutils.escapeHTML(data))
    //run our custom filters and send
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
     camclient.volatile.broadcast.emit('webcam',{'img':data});
  });
  camclient.on('disconnect', function () {
     camclient.volatile.broadcast.emit('cam disconnected');
  });  
});

