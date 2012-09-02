//my messages middleware!
var url   = require("url");
exports.resolveMessages = function(req,res,next){
  var messages = require('./conf/messages.json');
  res.locals["error"] = res.locals["info"] = res.locals["message"] = "";
  parts = url.parse(req.url).pathname.substr(1).split("/");
  //default first
  if (messages.default){
    for (m in messages.default){
      res.locals[m] = messages.default[m];
    }
  }

  pagemessages = "messages";
  for (p in parts){
    pagemessages += "."+parts[p];
  }
  try {
    messages = eval(pagemessages);
    for (m in messages){
      res.locals[m] = messages[m];
    }
  }
  catch(e){
    
  }
  next();
}
