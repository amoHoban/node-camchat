var cache = require('memory-cache');

exports.chatfilters = function(msg){

  // replace badwords
  require("./conf/badwords").forEach(function(word){
      msg = msg.replace(word,"****");
  });
  msg = msg.replace("&lt;3","&hearts;");
  
  if (cache.get("cachedresults")){
    //console.log("CACHE "+cache.get("cachedresults"));
    msg = replaceResults(msg);
  }
  else {
    walk("./public/img/emojis", function(err) {
    console.log("walking");
    if (err) throw err;
    msg = replaceResults(msg);
  return msg;
  });  
  
  }
  return msg;

};

exports.checkClientNickName = function(strVal){
  if (strVal === null) return false;
  return strVal.length > 2;
};

exports.escapeHTML = function(strVal) {
  strVal = strVal.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return strVal;
};

exports.checkMessageLength = function(m){
  if (m.length < 2 || m.length > 255)
    return false;
  return true;
};

exports.floodCheck = function(c){
  if (!c || c<=0) return true;
    if ((new Date().getTime() - c.lastMessageTime) > 500){
        c.lastMessageTime = new Date().getTime();
        return true;
    }
    c.lastMessageTime = new Date().getTime();
    return false;
};

var fs = require('fs');
var results = [];
  var walk = function(dir, done) {
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file.replace("/public","").replace(".",""));
          if (!--pending) done(null, results);
        }
      });
    });
  });
cache.put("cachedresults",results,600000);
};

var removePath = function(results, path){
  var newResults = [];
  results.forEach(function(result){
    newResults.push(result.replace(path,"").replace(".png","").replace(" ",""));
  });
  cache.put("cachednames",newResults,600000);
  return cache.get("cachednames");
}

var replaceResults = function(msg){
  results = cache.get("cachedresults");
  names = cache.get("cachednames") || removePath(results,"/img/emojis/");
    i = 0;
    names.forEach(function(name){
      msg = msg.replace(":"+name+":",'<img src="'+results[i]+'" class="emoji" />');
      i++;
    });
    console.log("MSG: "+msg);
    return msg;
  }