
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: index.title });
};

exports.test = function(req, res){
  res.render('test', { title: 'Test' });
};

exports.error404 = function(req, res){
  res.send(500, { title: 'Ooops! Page not found' });
};

