var db=require('./databaseConfig.js');

const Game = {
  insertNewGame: function(game, callback) {
    var conn = db.getConnection();

    conn.connect(function(err) {
      if (err) {
          console.log(err);
          return callback(err);
      } else {
          console.log("Connected!");
  
          // Validate price input
          var prices = game.price.split(",");
          for (var i = 0; i < prices.length; i++) {
              if (isNaN(parseFloat(prices[i]))) {
                  return callback("Invalid price format", null);
              }
          }
  
          // Validate platformid input
          var platformIds = game.platformid.split(",");
          for (var i = 0; i < platformIds.length; i++) {
              if (isNaN(parseInt(platformIds[i]))) {
                  return callback("Invalid platformid format", null);
              }
          }
  
          // Validate number of prices to number of platforms
          if (prices.length !== platformIds.length) {
              return callback("Prices and Platforms do not match", null);
          }
  
          // Validate categoryid input
          var categoryIds = game.categoryid.split(",");
          for (var i = 0; i < categoryIds.length; i++) {
              if (isNaN(parseInt(categoryIds[i]))) {
                  return callback("Invalid categoryid format", null);
              }
          }
  
          // Check if platformids exist in platform table
          var platformSql = 'SELECT COUNT(*) AS count FROM platform WHERE id IN (?)';
          conn.query(platformSql, [platformIds], function(err, platformResult) {
              if (err) {
                  conn.end();
                  return callback(err, null);
              }
  
              var platformCount = platformResult[0].count;
              if (platformCount !== platformIds.length) {
                  conn.end();
                  return callback("Invalid platformid(s)", null);
              }
  
              // Check if categoryids exist in category table
              var categorySql = 'SELECT COUNT(*) AS count FROM category WHERE id IN (?)';
              conn.query(categorySql, [categoryIds], function(err, categoryResult) {
                  if (err) {
                      return callback(err, null);
                  }
  
                  var categoryCount = categoryResult[0].count;
                  if (categoryCount !== categoryIds.length) {
                      return callback("Invalid categoryid(s)", null);
                  }
  
                  var sql = 'SELECT * FROM game WHERE game.title=?';
                  conn.query(sql, [game.title], function(err, results) {
                      if (err) {
                          return callback(err, null);
                      }
  
                      if (results.length === 1) {
                          return callback("Game already exists", null);
                      }
  
                      // All validations passed, insert the game
                      var insertSql = 'INSERT INTO game (title, description, price, platformid, categoryid, year) VALUES (?,?,?,?,?,?)';
                      conn.query(insertSql, [game.title, game.description, game.price, game.platformid, game.categoryid, game.year], function(err, results) {
                          conn.end();
  
                          if (err) {
                              return callback(err, null);
                          }
                          
                          return callback(null, results.insertId);
                          });
                      });
                  });
              });
          }
      });
    },
  

    //Retrieves games by Platform
    getGameByPlatform: function(platformid, callback) {
        var conn = db.getConnection();
      
        conn.connect(function(err) {
          if (err) {
            console.log(err);
            return callback(err);
          } else {
            console.log("Connected");
            
            //Selects prices based on the position of the platform ids in the platformid column. E.g. 35,45,55  1,2,3  Platform id: 1 = 35, 2 = 45, 3 = 55
            var sql = `
              SELECT game.id, game.title, game.description, 
              SUBSTRING_INDEX(SUBSTRING_INDEX(game.price, ',', FIND_IN_SET(?, game.platformid)), ',' , -1) AS price, 
              (SELECT platform_name FROM platform WHERE id=?) AS platform_name,
              category.id AS catid, category.catname, game.year, game.created_at
              FROM game
              JOIN category ON game.categoryid = category.id
              WHERE FIND_IN_SET(?, game.platformid) > 0
              `;
      
            conn.query(sql, [platformid, platformid, platformid], function(err, results) {
              if (err) {
                return callback(err, null);
              }
      
              return callback(null, results);
            });
          }
        });
      },

      // Deletes a game from the database based on its ID
      deleteGameByID: function(gameid, callback)  {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err);
            } else {
                console.log("Connected!");

                // SQL query to delete a game by its ID
                var sql = 'DELETE FROM game WHERE id=?';

                conn.query(sql, [gameid], function(err, results) {

                    conn.end();

                    if (err) {
                        return callback(err);
                    }

                    // Return null to indicate successful deletion
                    return callback(null, null);

                });
            }
        });
      },


      //Update games by ID
      updateGameByID: function(game, gameid, callback)  {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")
                
                // Validate price input
            var prices = game.price.split(",");
            for (var i = 0; i < prices.length; i++) {
                if (isNaN(parseFloat(prices[i]))) {
                    return callback("Invalid price format", null);
                }
            }

            // Validate platformid input
            var platformIds = game.platformid.split(",");
            for (var i = 0; i < platformIds.length; i++) {
                if (isNaN(parseInt(platformIds[i]))) {
                    return callback("Invalid platformid format", null);
                }
            }

            // Validate number of prices to number of platforms
            if(prices.length !== platformIds.length) {
              return callback("Prices and Platforms do not match", null);
            }


            // Validate categoryid input
            var categoryIds = game.categoryid.split(",");
            for (var i = 0; i < categoryIds.length; i++) {
                if (isNaN(parseInt(categoryIds[i]))) {
                    return callback("Invalid categoryid format", null);
                }
            }

            // Check if platformids exist in platform table
            var platformSql = 'SELECT COUNT(*) AS count FROM platform WHERE id IN (?)';
            conn.query(platformSql, [platformIds], function(err, platformResult) {
                if (err) {
                    conn.end();
                    return callback(err, null);
                }

                var platformCount = platformResult[0].count;
                if (platformCount !== platformIds.length) {
                    conn.end();
                    return callback("Invalid platformid(s)", null);
                }

                // Check if categoryids exist in category table
                var categorySql = 'SELECT COUNT(*) AS count FROM category WHERE id IN (?)';
                conn.query(categorySql, [categoryIds], function(err, categoryResult) {

                    if (err) {
                        return callback(err, null);
                    }

                    var categoryCount = categoryResult[0].count;
                    if (categoryCount !== categoryIds.length) {
                        return callback("Invalid categoryid(s)", null);
                    }

                    // All validations passed, insert the game
                    var sql = 'UPDATE game SET title=?, description=?, price=?, platformid=?, categoryid=?, year=? WHERE id=?'

                    conn.query(sql, [game.title, game.description, game.price, game.platformid, game.categoryid, game.year, gameid], function(err,results) {

                        conn.end();

                        if(err) {
                            return callback(err,null)
                        }

                        return callback(null,null)

                    })
                })
            })
          }
        })
      },

      // Retrieves the image name associated with a game title
      retrieveImage: function(gametitle, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                return callback(err);
            } else {
                console.log("Connected!");

                // SQL query to retrieve the image name for a given game title
                var sql = "SELECT game.image_name, game.title FROM game WHERE game.id=?";

                conn.query(sql, [gametitle], function(err, results) {
                    conn.end();

                    if (err) {
                        return callback(err, null);
                    }

                    // Pass the results (image name and title) to the callback
                    return callback(null, results);
                });
            }
        });
      },

      // Updates the image name for a game
      addImageName: function (image_name, gameid, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                return callback(err);
            }

            // SQL query to update the image name for a game based on its ID
            var sql = `UPDATE game SET image_name=? WHERE id=?`;

            conn.query(sql, [image_name, gameid], function (err, results) {
                conn.end();

                if (err) {
                    return callback(err);
                }

                return callback(null, null);
            });
        });
      },

      // Retrieves a game by its ID
      getGameByID: function (gameid, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                return callback(err);
            }

            // SQL query to select a game based on its ID
            var sql = `SELECT * FROM game WHERE id=?`;

            conn.query(sql, [gameid], function (err, results) {
                conn.end();

                if (err) {
                    return callback(err);
                }

                return callback(null, results);
            });
        });
      },

      // Retrieves all games
      getAllGames: function (callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                return callback(err);
            }

            // SQL query to select all games
            var sql = `SELECT * FROM game`;

            conn.query(sql, function (err, results) {
                conn.end();

                if (err) {
                    return callback(err);
                }

                return callback(null, results);
            });
        });
      }

      
}

module.exports=Game;