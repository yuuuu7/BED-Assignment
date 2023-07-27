var db = require('./databaseConfig');

var categoryDB = {
    getFilmByCategoryID: function (category_id, callback) {
        //get connection
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {

                const sql = "SELECT film.film_id, title, category.name, rating, release_year, length FROM film_category, category, film where film_category.category_id=? and film_category.category_id=category.category_id and film_category.film_id=film.film_id;"

                //execute sql command
                conn.query(sql, [category_id], function (err, result) {
                    conn.end()
                    if (err) {
                        //if an error occurs, console log the error for debugging purposes
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        var resultArr = [];

                        for (k = 0; k < result.length; k++) {
                            resultArr[k] = {
                                "film_id": result[k].film_id,
                                "title": result[k].title,
                                "name": result[k].name,
                                "category": result[k].category,
                                "rating": result[k].rating,
                                "release_year": result[k].release_year,
                                "Duration": result[k].length
                            }
                        }

                        //if no errors, returns the result
                        return callback(null, resultArr)
                    }
                })
            }
        })
    },



}

module.exports = categoryDB;