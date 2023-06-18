var db=require('./databaseConfig.js');

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
    }
}


module.exports = User