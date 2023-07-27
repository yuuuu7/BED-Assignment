const db = require("./databaseConfig")
const actorDB = {

    getActorByID: function (actorID, callback) {
        //get connection
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {

                const sql = "SELECT actor_id, first_name, last_name FROM bed_dvd_db.actor where actor_id=?;"

                //execute sql command
                conn.query(sql, [actorID], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    addActor: function (first_name, last_name, callback) {
        //get connection
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                //console log for debugging purposes
                console.log(err);
                return callback(err, null)
            } else {
                //if no error, execute the sql code
                const sql = "INSERT into bed_dvd_db.actor(first_name, last_name) values (?,?)"

                conn.query(sql, [first_name, last_name], function (err, result) {
                    conn.end()
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
    },

    listActors: function (limit, offset, callback) {
        //get connection
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {

                const sql = "SELECT actor_id, first_name, last_name FROM bed_dvd_db.actor ORDER BY first_name LIMIT ? OFFSET ?;"

                //execute sql command
                conn.query(sql, [limit, offset], function (err, result) {
                    conn.end()
                    if (err) {
                        //if there is an error while executing the sql command, console log the error
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        //if no errors, return the result
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    updateActorName: function (actor_id, first_name, last_name, callback) {
        //get connection
        var conn = db.getConnection();

        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if there is an error when trying to get connection
                console.log(err);
                return callback(err, null)
            } else {
                if (last_name == null) {
                    const sql = "Update actor set first_name=? where actor_id=?"

                    //execute xql command
                    conn.query(sql, [first_name, actor_id], function (err, result) {
                        conn.end()
                        if (err) {
                            //if there is an error while executing the sql command, console log the error
                            console.log(err)
                            return callback(err, null)
                        }
                        else {
                            // if successful, return result
                            console.log(result)
                            return callback(null, result);
                        }
                    })
                } else if (first_name == null) {
                    const sql = "Update actor set last_name=? where actor_id=?"

                    //execute xql command
                    conn.query(sql, [last_name, actor_id], function (err, result) {
                        conn.end()
                        if (err) {
                            //if there is an error while executing the sql command, console log the error
                            console.log(err)
                            return callback(err, null)
                        }
                        else {
                            // if successful, return the result
                            console.log(result)
                            return callback(null, result);
                        }
                    })
                } else {
                    const sql = "Update actor set first_name=?, last_name=? where actor_id=?"

                    //execute xql command
                    conn.query(sql, [first_name, last_name, actor_id], function (err, result) {
                        conn.end()
                        if (err) {
                            //if there is an error while executing the sql command, console log the error
                            console.log(err)
                            return callback(err, null)
                        }
                        else {
                            // if successful, return the result
                            console.log(result)
                            return callback(null, result);
                        }
                    })
                }
            }
        })
    },

    deleteActor: function (actor_id, callback) {
        //get connection
        var conn = db.getConnection();
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if there is an error while connecting, print it out for debugging purposes
                console.log(err);
                return callback(err, null);
            }
            else {
                //if not, continue on with code
                console.log("Connected!");
                var sql = 'Delete from actor where actor_id=?';
                //execute the sql command
                conn.query(sql, [actor_id], function (err, result) {
                    conn.end();
                    if (err) {
                        //if an error occurs, console log the error for debugging purposes
                        console.log(err);
                        return callback(err, null);
                    } else {
                        //if no errors, returns the result
                        return callback(null, result);
                    }
                })

            }
        })
    },

    getActorsForFilm: function (film_id, callback) {
        //get connection
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {

                const sql = "SELECT first_name, last_name FROM actor JOIN film_actor on actor.actor_id = film_actor.actor_id JOIN film on film.film_id = film_actor.film_id where film.film_id=?"

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
    }
}

module.exports = actorDB;