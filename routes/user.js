var express = require('express');
var router = express.Router();
var models = require('./models');
var error = require('./error');
var app = express();
var connection = require('./connection');
var _ = require('underscore');
var bcrypt = require('bcrypt');
var reso = require('./res');
var hat=require('hat');
var mkdirp = require('mkdirp');

router.get('/create', function(req, res) {
	var errobj = error.err_insuff_params( res, req, ["username","password","firstname","lastname"]);
	if(!errobj) {
		return;
	}

	var salt = bcrypt.genSaltSync(10);

	var username = req.query.username;
	var password = bcrypt.hashSync(req.query.password, salt);
	var firstname = req.query.firstname;
	var lastname = req.query.lastname;
	var date_of_birth = req.query.date_of_birth | '2014-12-22';

	var queryCreateUser = 'insert into users values ' + '("' + username + '","' + password + '","' + firstname + '","' + lastname + '","' + date_of_birth + '",' + 'NULL);';
	var strGetUser = 'select * from users where userName = "' + username + '";';
	//console.log(queryCreateUser);

	if(reso.sqlConnectCount==1) {
		connection.connect();
		//console.log("getting connected");
		reso.sqlConnectCount=2;
	}
	connection.query("use db1");

	connection.query(strGetUser, function(err, userData) {
		if(err) {
			console.log(err);
		}

		//console.log(userData);
		
		//deny if username already exists

		if(!(_.isEmpty(userData))) {
			error.err(res, "210");
			return;
		}
		else {
			connection.query(queryCreateUser, function(err) {
				if(err) {
					console.log(err);
				}
				reso.changeUser(username);
				debugger;
				res.end(JSON.stringify({result:true}));
			});
		}
	});

});

function generateAccessToken() {
	return hat();
}

router.get('/logout', function(req, res) {
	var querySetAccessTokenAsNULL = 'update users set accessToken=NULL' + ' where userName="' + reso.getCurrentUser() + '";';
	connection.query(querySetAccessTokenAsNULL,function(err) {
				console.log(querySetAccessTokenAsNULL);
				if(err) {
					console.log(err);
				}
				else {					
					reso.changeUser("default");
					reso.setCurrentAccessToken(null);
					res.end(JSON.stringify({result:true}));
				}
			});
});
router.get('/login', function(req, res) {
	var errobj = error.err_insuff_params( res, req, ["username","password"]);
	if(!errobj) {
		return;
	}

	var username = req.query.username;
	var password = req.query.password;

	console.log(username);
	console.log(password);

	var strGetUser = 'select * from users where userName = "' + username + '";';
	var currentAccessToken = generateAccessToken();
	var querySetAccessToken = 'update users set accessToken="' + currentAccessToken + '" where userName="' + username + '";';
	var querySetAccessTokenAsNULL = 'update users set accessToken=NULL' + ' where userName="' + username + '";'
	//console.log(strGetUser);

	if(reso.sqlConnectCount==1) {
		connection.connect();
		reso.sqlConnectCount=2;
	}
	
	connection.query("use db1");
	connection.query(strGetUser, function(err, userData) {
		if(err) {
			console.log(err);
			return;
		}
		if(!userData[0].password) {
			error.err(res,"305");
			return;
		}
		if(bcrypt.compareSync(password,userData[0].password)) {

			//res.end("Login successful");
			console.log(querySetAccessToken);
			connection.query(querySetAccessToken,function(err) {
				if(err) {
					console.log(err);
				}
				else {
					reso.changeUser(username);
					reso.setCurrentAccessToken(currentAccessToken);
					var userobj = {};
					userobj.username = username;
					userobj.access_token = currentAccessToken;
					userobj.firstname = userData[0].firstname;
					userobj.lastname = userData[0].lastName;

					res.end(JSON.stringify(userobj));
					/*res.redirect('/dashboard?access_token='+currentAccessToken);
					res.end();*/				
				}
			});
		}
		else {
			connection.query(querySetAccessTokenAsNULL,function(err) {
				console.log(querySetAccessTokenAsNULL);
				if(err) {
					console.log(err);
				}
				else {
					
					reso.changeUser("default");
					reso.setCurrentAccessToken(null);
					res.end("Invalid credentials");
				}
			});
		}
	});

});

module.exports = router;