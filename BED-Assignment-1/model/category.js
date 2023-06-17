var db=require('./databaseConfig.js');

const Category = {

    insertNewCat: function(category, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

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
    }
}

module.exports=Category;