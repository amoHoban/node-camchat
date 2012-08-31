
/*
 * GET home page.
 */

messages = require('../messages.json');

exports.index = function(req, res){
  res.render('login', { title: messages.index.title });
};

exports.test = function(req, res){
  res.render('test', { title: 'Test' });
};

exports.error404 = function(req, res){
  res.send(500, { title: 'Ooops! Page not found' });
};

