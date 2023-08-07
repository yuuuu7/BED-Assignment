var db=require('../db/databaseConfig');

const Platform = {
    // Inserts a new platform into the database
    insertNewPlatform: function(platform, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err);
                return callback(err);
            } else {
                console.log("Connected!");

                // SQL query to check if the platform already exists
                var sql = 'SELECT * FROM platform WHERE platform_name=?';
                // SQL query to insert a new platform into the database
                var sql2 = 'INSERT INTO platform (platform_name, description) VALUES (?, ?)';

                conn.query(sql, [platform.platform_name], function(err, results) {
                    if(err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    if(results.length > 0) {
                        // Platform already exists
                        return callback("Platform already exists", null);
                    }

                    conn.query(sql2, [platform.platform_name, platform.description], function(err, results) {
                        conn.end();

                        if(err) {
                            console.log(err);
                            return callback(err, null);
                        }

                        return callback(null, null);
                    });
                });
            };
        });
    },

    // Gets all platforms from the database
    getAllPlatformNames: function(callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                // SQL query to get all platforms
                var sql = 'SELECT platform.platform_name, platform.id FROM platform';

                conn.query(sql, function(err, results) {
                    conn.end();

                    if(err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    return callback(null, results);
                });
            };
        });
    },

    retrievePlatformId: function (platform, callback) {
        var conn = db.getConnection();
      
        conn.connect(function (err) {
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            console.log("Connected!");
      
            var platform_names = platform.split(',');
            var promises = [];
      
            for (var i = 0; i < platform_names.length; i++) {
              // Create a Promise for each query
              var promise = new Promise(function (resolve, reject) {
                var sql = 'SELECT id FROM platform WHERE platform_name=?';
      
                conn.query(sql, [platform_names[i]], function (err, results) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(results);
                  }
                });
              });
      
              promises.push(promise);
            }
      
            // Wait for all promises to resolve using Promise.all
            Promise.all(promises)
              .then(function (results) {
                // Close the database connection
                conn.end();
      
                // Combine the results from all queries
                var combinedResults = [];
                results.forEach(function (result) {
                  combinedResults = combinedResults.concat(result);
                });
                
                return callback(null, combinedResults);
              })
              .catch(function (err) {
                console.log(err);
                conn.end();
                return callback(err, null);
              });
          };
        });
      }
      
}


module.exports = Platform;