const db = require("./databaseConfig")
const filmDB = {

    getFilms: function (filmTitle, maxPrice, catName, callback) {
        //get connection
        const conn = db.getConnection()
        const string = "%" + filmTitle + "%"
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else if ((typeof (catName) == "undefined" || catName == "none")) {

                if (isNaN(maxPrice)) {
                    const sql = `SELECT convert(film.image USING utf8) as image, film.description, film.replacement_cost, film.film_id, title, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, category.name FROM bed_dvd_db.film JOIN film_category ON film.film_id = film_category.film_id JOIN category on category.category_id = film_category.category_id WHERE film.title LIKE ?;`
                    //execute sql command
                    conn.query(sql, [string], function (err, result) {
                        conn.end()
                        if (err) {
                            console.log(err)
                            return callback(err, null)
                        }
                        else {
                            return callback(null, result)
                        }
                    })
                } else {
                    const sql2 = `SELECT convert(film.image USING utf8) as image, film.description, film.replacement_cost, film.film_id, title,release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, category.name FROM bed_dvd_db.film JOIN film_category ON film.film_id = film_category.film_id JOIN category on category.category_id = film_category.category_id WHERE film.title LIKE ? AND rental_rate <=?;`
                    //execute sql command
                    conn.query(sql2, [string, maxPrice], function (err, result) {
                        conn.end()
                        if (err) {
                            console.log(err)
                            return callback(err, null)
                        }
                        else {
                            return callback(null, result)
                        }
                    })
                }
            } else {
                const sql3 = `SELECT category_id FROM bed_dvd_db.category WHERE category.name=?;`
                conn.query(sql3, [catName], function (err, result) {
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        if (isNaN(maxPrice)) {
                            const sql4 = `SELECT convert(film.image USING utf8) as image, film.description, film.replacement_cost, film.film_id, title, category.name, rating, release_year, length, film.rental_rate FROM film_category JOIN category ON film_category.category_id = category.category_id JOIN film ON film_category.film_id = film.film_id WHERE film_category.category_id=?;`
                            //execute sql command
                            conn.query(sql4, [result[0].category_id], function (err, result) {
                                conn.end()
                                if (err) {
                                    console.log(err)
                                    return callback(err, null)
                                }
                                else {
                                    return callback(null, result)
                                }
                            })
                        } else {
                            const sql5 = `SELECT convert(film.image USING utf8) as image, film.description, film.replacement_cost, film.film_id, title, category.name, rating, release_year, length, film.rental_rate FROM film_category JOIN category ON film_category.category_id = category.category_id JOIN film ON film_category.film_id = film.film_id WHERE film_category.category_id=? AND film.rental_rate <=?;`
                            //execute sql command
                            conn.query(sql5, [result[0].category_id, maxPrice], function (err, result) {
                                conn.end()
                                if (err) {
                                    console.log(err)
                                    return callback(err, null)
                                }
                                else {
                                    return callback(null, result)
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    getAllCategories: function (callback) {
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {
                const sql = `SELECT name FROM bed_dvd_db.category;`
                //execute sql command
                conn.query(sql, [], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    addFilm: function (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, image, category_name, store_id, callback) {
        //get connection
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                //console log for debugging purposes
                console.log(err);
                return callback(err, null)
            } else {
                //if no error, execute the sql code
                const sql = "INSERT into bed_dvd_db.film(title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, image) values (?,?,?,?,?,?,?,?,?,?,?)"

                conn.query(sql, [title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, image], function (err, result) {
                    if (err) {
                        //console log any errors for debugging
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        const film_id = result.insertId
                        const sql = "SELECT category_id FROM bed_dvd_db.category where name=?;"

                        conn.query(sql, [category_name], function (err, result) {
                            if (err) {
                                //console log any errors for debugging
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                console.log(result)
                                const cat_id = result[0].category_id
                                const sql = "INSERT into bed_dvd_db.film_category(film_id, category_id) value (?,?)"

                                conn.query(sql, [film_id, cat_id], function (err, result) {
                                    if (err) {
                                        //console log any errors for debugging
                                        console.log(err)
                                        return callback(err, null)
                                    }
                                    else {
                                        const sql = "INSERT into bed_dvd_db.inventory(film_id, store_id) value (?,?)"

                                        conn.query(sql, [film_id, store_id], function (err, result) {
                                            if (err) {
                                                //console log any errors for debugging
                                                console.log(err)
                                                return callback(err, null)
                                            }
                                            else {
                                                console.log(result)
                                                return callback(null, result);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }


        })
    },

    getAllLangs: function (callback) {
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {
                const sql = `SELECT name FROM bed_dvd_db.language;`
                //execute sql command
                conn.query(sql, [], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    addFilmReview: function (title, review_text, review_number, email, callback) {
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {
                const sql = `SELECT film_id FROM bed_dvd_db.film WHERE title =?;`
                //execute sql command
                conn.query(sql, [title], function (err, result) {
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        const film_id = result[0].film_id
                        const sql = `SELECT customer_id FROM bed_dvd_db.customer WHERE email =?;`
                        //execute sql command
                        conn.query(sql, [email], function (err, result) {
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                const reviewer_id = result[0].customer_id
                                const sql = `INSERT into bed_dvd_db.reviews(review_text, review_number, reviewer_id, film_id) value (?,?,?,?)`
                                //execute sql command
                                conn.query(sql, [review_text, review_number, reviewer_id, film_id], function (err, result) {
                                    conn.end()
                                    if (err) {
                                        console.log(err)
                                        return callback(err, null)
                                    }
                                    else {
                                        return callback(null, result)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    getAllReviews: function (film_id, callback) {
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {
                const sql = `SELECT * FROM bed_dvd_db.reviews where film_id=?;`
                //execute sql command
                conn.query(sql, [film_id], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })


            }
        })
    },

    getFilmbyId: function (film_id, callback) {
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {
                const sql = `SELECT title FROM bed_dvd_db.film where film_id=?;`
                //execute sql command
                conn.query(sql, [film_id], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })


            }
        })
    },

}


module.exports = filmDB;