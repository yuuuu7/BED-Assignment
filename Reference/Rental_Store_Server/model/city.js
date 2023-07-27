var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

var cityDB = {
	getCities: function (callback) {

		var conn = db.getConnection();

		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");

				const sql = "SELECT city, country_id FROM bed_dvd_db.city;";

				conn.query(sql, [], function (err, result) {
					conn.end();
					if (err) {
						console.log("Err: " + err);
						return callback(err, null, null);
					} else {    
                        console.log(result)
                        return callback(null, result)
					}  //else
				});
			}
		});
	},
};

module.exports = cityDB;

