var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

var userDB = {
	login: function (email, password, callback) {

		var conn = db.getConnection();

		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");

				var sql = "SELECT store_id, first_name, last_name, email, password, role, 'customer' as title FROM customer WHERE email=? AND password =? UNION SELECT store_id, first_name, last_name, email, password, role, 'staff' as title FROM staff WHERE email=? AND password = ?";

				conn.query(sql, [email, password, email, password], function (err, result) {
					conn.end();

					if (err) {
						console.log("Err: " + err);
						return callback(err, null, null);
					} else {
						var token = "";
						var i;
						if (result.length == 1) {
							console.log(result)
							token = jwt.sign({ id: result[0].userid, role: result[0].role }, config.key, {
								expiresIn: 86400 //expires in 24 hrs
							});
							console.log("@token " + token);
							return callback(null, token, result);


						} else {
							var err2 = new Error("UserID/Password does not match.");
							err2.statusCode = 500;
							return callback(err2, null, null);
						}
					}  //else
				});
			}
		});
	},
};

module.exports = userDB;

