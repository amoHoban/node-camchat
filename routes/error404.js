
/*
 * GET home page.
 */

exports.error404 = function(req, res){
  res.render('error404', { title: 'Ooops! Page not found' });
};