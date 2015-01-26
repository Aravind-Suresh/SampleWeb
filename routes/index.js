
/*
 * GET home page.
 */
var path = require('path');

exports.index = function(req, res){
  //res.sendfile(path.resolve('../public/loginpage.html'))
  res.end("hello");
};
