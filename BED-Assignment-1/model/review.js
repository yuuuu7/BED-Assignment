var db=require('./databaseConfig.js');

const Review = {
    insertNewReview: function(userid, gameid, review, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                console.log(err)
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = 'INSERT INTO reviews (content, rating, game_id, user_id) VALUES (?,?,?,?)'

                conn.query(sql, [review.content, review.rating, gameid, userid], function(err,results) {
                    conn.end();

                    if(err) {
                        console.log(err)
                        return callback(err, null)
                    }
                        
                    return callback(null, results.insertId)
                    });

            }
        });
    },

    getReviewByGameID: function(gameid, callback) {
        var conn = db.getConnection();

        conn.connect(function(err) {
            if(err) {
                return callback(err)
            } else {
                console.log("Connected!")

                var sql = `
                SELECT game.id AS gameid, reviews.content, reviews.rating, users.username, reviews.created_at
                FROM reviews
                JOIN game ON reviews.game_id = game.id
                JOIN users ON reviews.user_id = users.userid
                WHERE game.id=?
                `

                conn.query(sql, [gameid], function(err,results) {
                    conn.end();

                    if(err) {
                        return callback(err,null)
                    }

                    return callback(null,results)
                })
            }
        })
    }
}

module.exports=Review;