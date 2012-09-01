exports.checkClientNickName = function(strVal){
  if (strVal == null) return false;
  return strVal.length > 3;
}

exports.escapeHTML = function(strVal) {
  strVal = strVal.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return strVal;
}

exports.checkMessageLength = function(m){
  if (m.length < 2 || m.length > 255)
    return false;
  return true;
}

exports.floodCheck = function(c){
  if (!c || c<=0) return true;
    if ((new Date().getTime() - c.lastMessageTime) > 500){
        c.lastMessageTime = new Date().getTime();
        return true;
    }
    c.lastMessageTime = new Date().getTime();
    return false;
}