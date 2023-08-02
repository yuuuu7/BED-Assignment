var db=require('../db/databaseConfig');

const Category = {

    // Insert a new category into the database
    insertNewCat: function(category, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                // Check if the category already exists in the database
                var sql = 'SELECT * FROM category WHERE catname=?'
                var sql2 = 'INSERT INTO category (catname,description) VALUES (?,?)'

                conn.query(sql, [category.catname], function(err,results) {
                    
                    if(err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    
                    if(results.length > 0) {
                        return callback("Category already exists", null)
                    }

                    // Insert the new category into the database
                    conn.query(sql2, [category.catname, category.description], function(err,results) {
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
    },

    retrieveAllCatNames: function(callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connected!")

                var sql = 'SELECT catname FROM category'

                conn.query(sql, function(err,results) {
                    conn.end();
                    
                    if(err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    
                    return callback(null, results)
                });
            };
        });
    },

    retrieveCatId: function(catname, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connected!")

                
            var category_names = catname.split(',');
            var promises = [];
      
            for (var i = 0; i < category_names.length; i++) {
              // Create a Promise for each query
              var promise = new Promise(function (resolve, reject) {
                var sql = 'SELECT id FROM category WHERE catname=?';
      
                conn.query(sql, [category_names[i]], function (err, results) {
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


module.exports=Category;