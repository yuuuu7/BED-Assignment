var db=require('./databaseConfig.js');

const Game = {
    insertNewGame: function(game, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = 'INSERT INTO game (title,description,price,platformid,categoryid,year) VALUES (?,?,?,?,?,?)'

                conn.query(sql, [game.title,game.description,game.price,game.platformid,game.categoryid,game.year], function(err,results) {
                    conn.end();

                    if(err) {
                        return callback(err, null)
                    }

                    return callback(null,results.insertId)
                })
            }
        })
    },

    getGameByPlatform: function(platformid, callback) {
        var conn = db.getConnection();
      
        conn.connect(function(err) {
          if (err) {
            console.log(err);
            return callback(err);
          } else {
            console.log("Connected");
      
            var sql = `
              SELECT game.id, game.title, game.description, 
              SUBSTRING_INDEX(SUBSTRING_INDEX(game.price, ',', FIND_IN_SET(?, game.platformid)), ',' , -1) AS price, 
              platform.platform_name, category.id AS catid, category.catname, game.year, game.created_at
              FROM game
              JOIN platform ON game.platformid = platform.id
              JOIN category ON game.categoryid = category.id
              WHERE FIND_IN_SET(?, game.platformid) > 0`;
      
            conn.query(sql, [platformid, platformid], function(err, results) {
              if (err) {
                return callback(err, null);
              }
      
              return callback(null, results);
            });
          }
        });
      },

      deleteGameByID: function(gameid, callback)  {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = 'DELETE FROM game WHERE id=?'

                conn.query(sql, [gameid], function(err,results) {

                    conn.end();

                    if(err) {
                        return callback(err)
                    }

                    return callback(null,null)

                })
            }
        })
      },

      updateGameByID: function(game, gameid, callback)  {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = 'UPDATE game SET title=?, description=?, price=?, platformid=?, categoryid=?, year=? WHERE id=?'

                conn.query(sql, [game.title, game.description, game.price, game.platformid, game.categoryid, game.year, gameid], function(err,results) {

                    conn.end();

                    if(err) {
                        return callback(err,null)
                    }

                    return callback(null,null)

                })
            }
        })
      },
      
}

module.exports=Game;