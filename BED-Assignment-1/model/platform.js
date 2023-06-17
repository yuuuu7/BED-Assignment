var db=require('./databaseConfig.js');

const Platform = {
    insertNewPlatform: function(platform, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = 'SELECT * FROM platform WHERE platform_name=?'
                var sql2 = 'INSERT INTO platform (platform_name,description) VALUES (?,?)'

                conn.query(sql, [platform.platform_name], function(err,results) {
                    
                    if(err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    
                    if(results.length > 0) {
                        return callback("Platform already exists", null)
                    }

                    conn.query(sql2, [platform.platform_name, platform.description], function(err,results) {
                        conn.end();
                        
                        if(err) {
                            console.log(err)
                            return callback(err, null)
                        }
                        
                        return callback(null, null)
                    });
                });

            };
        });
    }
}

module.exports = Platform;