
/*
 * GET home page.
 */

messages = require('../messages.json');

exports.login = function(req, res){
  res.render('login', { title: messages.index.title });
};

exports.index = function(req, res){
  res.render('login', { title: messages.index.title });
};

exports.test = function(req, res){
  res.render('test', { title: 'Test' });
};

exports.error404 = function(req, res){
  res.render('error404', { title: 'Ooops! Page not found' });
};

