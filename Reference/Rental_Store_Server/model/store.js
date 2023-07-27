var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

var userDB = {
	getStoreAddresses: function (callback) {

		var conn = db.getConnection();

		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");

				var sql = "SELECT * FROM bed_dvd_db.address JOIN store on address.address_id = store.address_id;";

				conn.query(sql, [], function (err, result) {
					conn.end();

					if (err) {
						console.log("Err: " + err);
						return callback(err, null);
					} else {
						console.log(result)
						return callback(null, result)
					}
				});
			}
		});
	},

};

module.exports = userDB;

