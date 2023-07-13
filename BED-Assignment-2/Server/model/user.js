var db=require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

const User = {

    // Retrieves all users from the database
    getAllUsers: function(callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err);
                return callback(err);
            } else {
                console.log("Connected!");

                var sql = 'SELECT * FROM users';

                conn.query(sql, function(err, results) {
                    conn.end();

                    if(err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    return callback(null, results);
                });
            }
        });
    },

    // Adds a new user to the database
    addNewUser: function(user, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err);
                return callback(err);
            } else {
                console.log("Connected!");

                var sql =  'SELECT * FROM users WHERE email=?';
                var sql2 = 'INSERT INTO users (username,email,password,type,profile_pic_url) VALUES (?,?,?,?,?)';

                conn.query(sql, [user.email], function(err, results) {
                    if(err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    if(results.length > 0) {
                        return callback('Email already exists', null);
                    }

                    conn.query(sql2, [user.username, user.email, user.password, user.type, user.profile_pic_url], function(err, results) {
                        conn.end();
                        
                        if(err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        
                        return callback(null, results.insertId);
                    });
                });

            }
        });
    },

    // Finds a user by ID
    findUserByID: function(userID, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err);
                return callback(err);
            } else {
                console.log("Connected!");

                var sql = 'SELECT * FROM users WHERE userid=?';

                conn.query(sql, [userID], function(err, results) {
                    conn.end();
                    
                    if(err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    
                    return callback(null, results);
                });
            }
        });
    },

    loginUser: function (email, password, callback) {

		var conn = db.getConnection();

		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");

				var sql = 'select * from users where email=? and password=?';

				conn.query(sql, [email, password], function (err, result) {
					conn.end();

					if (err) {
						console.log("Err: " + err);
						return callback(err, null, null);
					} else {
						var token = "";
						var i;
						if (result.length == 1) {

							token = jwt.sign({ id: result[0].userid, role: result[0].role }, config.key, {
								expiresIn: 86400 //expires in 24 hrs
							});
							console.log("@@token " + token);
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
}


module.exports = User