
/*
 * GET home page.
 */

messages = require('../messages.json');

exports.login = function(req, res){
  res.render('login');
};

exports.index = function(req, res){
	console.log(res.locals);
  res.render('login');
};

exports.test = function(req, res){
  res.render('test');
};

exports.error404 = function(req, res){
  res.render('error404');
};

