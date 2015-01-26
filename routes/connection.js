var mysql = require('mysql');

var connection =  mysql.createConnection({
    user : "root",
    password: "password"
});

module.exports = connection;