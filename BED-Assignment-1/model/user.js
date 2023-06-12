var db=require('./databaseConfig.js');

const User = {

    getAllUsers: function(callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = 'SELECT * FROM users'

                conn.query(sql, function(err, results) {
                    conn.end()

                    if(err) {
                        console.log(err)
                        return callback(err,null)
                    }

                    return callback(null,results)
                })
            }
        })
    },

    addNewUser: function(user, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = 'INSERT INTO users (username,email,password,type,profile_pic_url) VALUES (?,?,?,?,?)'

                conn.query(sql, [user.username, user.email, user.password, user.type, user.profile_pic_url], function(err,results) {
                    conn.end();
                    
                    if(err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    
                    return callback(null, results.insertId)
                })
            }
        })
    }
}

module.exports = User