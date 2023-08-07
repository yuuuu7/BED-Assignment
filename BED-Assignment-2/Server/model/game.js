const { call } = require('function-bind');
var db=require('../db/databaseConfig');

const Game = {
  insertNewGame: function(game, imageName, callback) {
    var conn = db.getConnection();

    conn.connect(function(err) {
      if (err) {
          console.log(err);
          return callback(err);
      } else {
          console.log("Connected!");

          only1GamePrice = false
          only1GamePlatform = false
          only1GameCategory = false

          // Validate price input
          if (game.price.includes(",")) {
            var prices = game.price.split(",");
            for (var i = 0; i < prices.length; i++) {
                if (isNaN(parseFloat(prices[i]))) {
                    return callback("Invalid price format", null);
                }
            }
          } else {
            if (isNaN(parseFloat(game.price))) {
              return callback("Invalid price format", null);
            }
            only1GamePrice = true
          }
  
          // Validate platformid input
          if (game.platformid.includes(",")) {

            var platformIds = game.platformid.split(",");
            for (var i = 0; i < platformIds.length; i++) {
                if (isNaN(parseInt(platformIds[i]))) {
                    return callback("Invalid platformid format", null);
                }
            }
          } else {

            if (isNaN(parseInt(game.platformid))) {
              return callback("Invalid platformid format", null);
            }

            platformIds = game.platformid
            only1GamePlatform = true

          }
          
          if(only1GamePrice !== true && only1GamePlatform !== true) {
            
            // Validate number of prices to number of platforms
            if (prices.length !== platformIds.length) {
                return callback("Prices and Platforms do not match", null);
            }
          }
  
          // Validate categoryid input
          if (game.categoryid.includes(",")) {

            var categoryIds = game.categoryid.split(",");
            for (var i = 0; i < categoryIds.length; i++) {
                if (isNaN(parseInt(categoryIds[i]))) {
                    return callback("Invalid categoryid format", null);
                }
            }

          } else {

            if (isNaN(parseInt(game.categoryid))) {
              return callback("Invalid categoryid format", null);
            }

            categoryIds = game.categoryid
            only1GameCategory = true
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
                      var insertSql = 'INSERT INTO game (title, description, price, platformid, categoryid, year, image_name) VALUES (?,?,?,?,?,?,?)';
                      conn.query(insertSql, [game.title, game.description, game.price, game.platformid, game.categoryid, game.year, imageName], function(err, results) {
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
  

    // Retrieves games by Platform
    getGameByPlatform: function(platformName, callback) {
      var conn = db.getConnection();

      conn.connect(function(err) {
        if (err) {
          console.log(err);
          return callback(err);
        } else {
          console.log("Connected to getGameByPlatform EP");
          
          // Get the platform ID based on the user's search value
          var getPlatformIdSql = `SELECT id FROM platform WHERE platform_name = ?`;

          conn.query(getPlatformIdSql, [platformName], function(err, platformResults) {
            if (err) {
              conn.end();
              return callback(err, null);
            }

            if (platformResults.length === 0) {
              conn.end();
              return callback(new Error("Platform not found."), null);
            }

            var platformId = platformResults[0].id;

            // Selects games based on the platform ID
            var sql = `
              SELECT game.id, game.title, game.description, 
              SUBSTRING_INDEX(SUBSTRING_INDEX(game.price, ',', FIND_IN_SET(?, game.platformid)), ',' , -1) AS price, 
              (SELECT platform_name FROM platform WHERE id=?) AS platform_name,
              category.id AS catid, category.catname, game.year, game.created_at
              FROM game
              JOIN category ON game.categoryid = category.id
              WHERE FIND_IN_SET(?, game.platformid) > 0
            `;

            conn.query(sql, [platformId, platformId], function(err, results) {
              conn.end();
              if (err) {
                return callback(err, null);
              }

              return callback(null, results);
            });
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
      updateGameByID: function(game, gameid, imageName, callback)  {
        var conn = db.getConnection();

      conn.connect(function(err) {
        if (err) {
            console.log(err);
            return callback(err);
        } else {
            console.log("Connected! here");

            only1GamePrice = false
            only1GamePlatform = false
            only1GameCategory = false

            // Validate price input
            if (game.price.includes(",")) {
              var prices = game.price.split(",");
              for (var i = 0; i < prices.length; i++) {
                  if (isNaN(parseFloat(prices[i]))) {
                      return callback("Invalid price format", null);
                  }
              }
            } else {
              if (isNaN(parseFloat(game.price))) {
                return callback("Invalid price format", null);
              }
              only1GamePrice = true
            }

            // Validate platformid input
            if (game.platformid.includes(",")) {
              var platformIds = game.platformid.split(",");
              for (var i = 0; i < platformIds.length; i++) {
                  if (isNaN(parseInt(platformIds[i]))) {
                      return callback("Invalid platformid format", null);
                  }
              }
            } 

            platformIds = [game.platformid]
            only1GamePlatform = true

            
            
            if(only1GamePrice !== true && only1GamePlatform !== true) {
              
              // Validate number of prices to number of platforms
              if (prices.length !== platformIds.length) {
                  return callback("Prices and Platforms do not match", null);
              }
            }

            // Validate categoryid input
            if (game.categoryid.includes(",")) {

              var categoryIds = game.categoryid.split(",");
              for (var i = 0; i < categoryIds.length; i++) {
                  if (isNaN(parseInt(categoryIds[i]))) {
                      return callback("Invalid categoryid format", null);
                  }
              }

            } 

            categoryIds = [game.categoryid]
            only1GameCategory = true
            
            
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

                        var sql = 'SELECT image_name from game where id=?'
                        conn.query[sql, [gameid], function(err, results) {
                            if(err) {
                                return callback(err, null);
                            }

                            var oldImageName = results[0].image_name;

                            if (imageName == oldImageName || imageName === null || imageName === undefined || imageName === "") {
                                imageName = oldImageName
                            } else {
                              var fs = require('fs');
                              fs.unlinkSync('./public/images/' + oldImageName);
                            }

                            // All validations passed, insert the game
                            console.log('Nice')
                            var sql = 'UPDATE game SET title=?, description=?, price=?, platformid=?, categoryid=?, year=?, image_name=? WHERE id=?'
                            conn.query(sql, [game.title, game.description, game.price, game.platformid, game.categoryid, game.year, imageName, gameid], function(err, results) {
                                conn.end();

                                if (err) {
                                    return callback(err, null);
                                }
                                
                                return callback(null, null);
                                });
                        }]
                        
                    });
                });
            }
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
      getAllGameNames: function (callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                return callback(err);
            }

            // SQL query to select all games
            var sql = `SELECT game.title FROM game`;

            conn.query(sql, function (err, results) {
                conn.end();

                if (err) {
                    return callback(err);
                }

                return callback(null, results);
            });
        });
      },

        //Retrieve games via search bar
        gameSelectByName: function (option, callback) {
            var conn = db.getConnection();

            conn.connect(function (err) {
                if (err) {
                    return callback(err);
                }
                console.log("Connected to Search EP");

                // SQL query to select games based on search input
                var sql = `SELECT * FROM game WHERE title=?`;

                conn.query(sql, [option], function (err, results) {
                    conn.end();

                    if (err) {
                        return callback(err);
                    }

                    return callback(null, results);
                });
            });
        },

        // Retrieves games by Platform or Game Title
        getAllGamesPlatform: function (search, callback) {
          var conn = db.getConnection();

          conn.connect(function (err) {
            if (err) {
              console.log(err);
              return callback(err);
            } else {
              console.log("Connected to getAllGamesPlatform EP");

              var sql = 'SELECT * FROM platform';
              var sql2 = `
                SELECT game.id, game.title, game.description, game.image_name,
                SUBSTRING_INDEX(SUBSTRING_INDEX(game.price, ',', FIND_IN_SET(?, game.platformid)), ',' , -1) AS price, 
                (SELECT platform_name FROM platform WHERE id=?) AS platform_name,
                category.id AS catid, category.catname, game.year, game.created_at
                FROM game
                JOIN category ON game.categoryid = category.id
                WHERE FIND_IN_SET(?, game.platformid) > 0
                AND (
                  (game.title LIKE ?) OR (SELECT platform_name FROM platform WHERE id=?) LIKE ?
                )
              `;

              conn.query(sql, function (err, results) {
                if (err) {
                  return callback(err, null);
                }

                if (results.length === 0) {
                  console.log('empty');
                  return callback(null, null);
                }

                const promises = [];
                const resultsArray = [];

                for (let i = 1; i <= results.length; i++) {
                  const queryPromise = new Promise((resolve, reject) => {
                    conn.query(sql2, [i, i, i, `%${search}%`, i, `%${search}%`], function (err, results) {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(results);
                      }
                    });
                  });

                  promises.push(queryPromise);
                }

                Promise.all(promises)
                  .then((resultsArrays) => {
                    resultsArrays.forEach((array) => {
                      resultsArray.push(...array);
                    });

                    console.log(resultsArray);
                    callback(null, resultsArray);
                  })
                  .catch((err) => {
                    console.log(err);
                    callback(err, null);
                  });
              });
            }
          });
        },


          getGameByID: function(gameid, callback) {
            var conn = db.getConnection();
      
            conn.connect(function(err) {
              if (err) {
                return callback(err);
              }
      
              var sql = `SELECT * FROM game WHERE id=?`;
      
              conn.query(sql, [gameid], function(err, results) {
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