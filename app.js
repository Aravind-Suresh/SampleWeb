
/**
 * Module dependencies.
 */

 var express = require('express');
 var routes = require('./routes');
 var multer  = require('multer');
 var error = require('./routes/error');
 var reso = require('./routes/res');
 var connection = require('./routes/connection');
 var _ = require('underscore');

 var path = require('path');
 var auth = require("./routes/user");

 var app = module.exports = express();


// Configuration
/*
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
*/

// Routes

app.use(express.static(__dirname + '/public'));
//app.use('/', routes.index);

app.use('/auth',auth);

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
  return filename+Date.now();
},
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

function checkValidAccessToken(access_token) {
  if(reso.sqlConnectCount == 1) {
    connection.connect();
    
    connection.query("use db1");

    var queryAccessToken = 'select * from users where accessToken="' + access_token + '";';
    console.log(queryAccessToken); 

    connection.query('queryAccessToken', function(err, userData) {
      if(err) {
        console.log(err);
        return false;
      }
      else {
        if(userData[0].accessToken == access_token) {
          return true;
        }
        else return false;
      }
    });
    reso.sqlConnectCount = 2;
  }
}

app.get('/dashboard',function( req, res) {
  var errobj = error.err_insuff_params( res, req, ["access_token"]);
  if(!errobj) {
    return;
  }
  var access_token = req.query.access_token;
  console.log(access_token);
  res.sendfile('./public/dashboard.html');
});

app.get('/dashboard/get/uploads',function(req, res) {
  var errobj = error.err_insuff_params( res, req, ["access_token"]);
  if(!errobj) {
    return;
  }
  var access_token = req.query.access_token;
  var queryGetFileList = 'select * from filelist where userName="' + reso.getCurrentUser() + '";';
  if(reso.getCurrentAccessToken()==access_token) {
    connection.query(queryGetFileList, function(err,fileList) {
      if(err) {
        console.log(err);
      }
      else {
        res.end(JSON.stringify(fileList));
      }
    });
  }
  else error.err(res,"909");
});
app.get('/uploads/get', function(req, res) {
  var errobj = error.err_insuff_params( res, req, ["file","access_token"]);
  if(!errobj) {
    return;
  }
  var access_token = req.query.access_token;
  var file_name = req.query.file;
  var queryGetFile = 'select * from filelist where username=(select username from users where accessToken="' + access_token + '");'
  connection.query(queryGetFile, function(err, fileData) {
    if(err) {
      console.log(err);
    }
    else if(!fileData) {
      error.err(res,"909");
    }
    else {
      console.log(fileData);
      var len = fileData.length;
      var dum;
      for(var i=0;i<len;i++) {
        if(fileData[i].fileName == file_name) {
          dum = i;
          break;
        }
      }
      var filepath = './uploads/' + fileData[dum].fileName;
      console.log(filepath);
      res.download(filepath, function(err) {
        if(err) console.log(err);
      });
      //res.end(JSON.stringify({result:true,path:filepath}));
      //res.sendfile('./uploads/'+fileData[dum].fileName);
    }
  });
});
app.post('/upload',function(req,res){
  //TODO: check if logged in
  if(done==undefined) {
    error.err("101");
  }
  else if(done==true){
    console.log(req.files);
    console.log(req.query);
    res.redirect('/dashboard?access_token=' + reso.getCurrentAccessToken());
    var queryInsertFileName = 'insert into filelist values ("' + reso.getCurrentUser() + '","' + req.files.userPhoto.name + '","' + req.files.userPhoto.originalname + '");';
    connection.query(queryInsertFileName,function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
});

app.listen(3000, function(){
  //console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  console.log("Server running");
});
