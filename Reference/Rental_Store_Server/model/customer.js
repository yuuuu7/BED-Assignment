var db = require('./databaseConfig')

var customerDB = {
    getPaymentDetails: function (customer_id, start_date, end_date, callback) {
        //get connection
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {

                const sql = "SELECT film.title, amount, payment_date FROM payment, customer, rental, film, inventory where payment.customer_id=? and payment.customer_id=customer.customer_id and payment.rental_id=rental.rental_id and rental.inventory_id=inventory.inventory_id and inventory.film_id=film.film_id and payment_date between ? and ?"

                //execute sql command
                conn.query(sql, [customer_id, start_date, end_date], function (err, result) {
                    conn.end()
                    if (err) {
                        //if an error occurs, console log the error for debugging purposes
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

    addCustomer: function (store_id, first_name, last_name, email, address, callback) {
        //get connection
        let conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                //console log for debugging purposes
                console.log(err);
                return callback(err, null)
            } else {
                //if no error, execute the first sql code to enter data into address table to get the inserted address_id first
                const sql = "INSERT into bed_dvd_db.address(address, address2, district, city_id, postal_code, phone) values (?,?,?,?,?,?)"

                conn.query(sql, [address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone], function (err, result) {
                    if (err) {
                        //console log any errors for debugging
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        //if no errors, execute sql code to enter data into customer table
                        const sql2 = "INSERT into bed_dvd_db.customer(store_id, first_name, last_name, email, address_id) values (?,?,?,?,?)"

                        conn.query(sql2, [store_id, first_name, last_name, email, result.insertId], function (err, result) {
                            conn.end()
                            if (err) {
                                //console log any errors for debugging
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                //if no error, return reuslt
                                console.log(result)
                                return callback(null, result);
                            }
                        })
                    }
                })
            }

        })
    },

    confirmOrder: function (customer_id, cardNum, cartString, total, callback) {


        let conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                //console log for debugging purposes
                console.log(err);
                return callback(err, null)
            } else {
                //if no error, execute the first sql code to enter data into address table to get the inserted address_id first
                const sql = "INSERT into bed_dvd_db.orders(customer_id, order_cart, total, payment_details) values (?,?,?,?)"

                conn.query(sql, [customer_id, cartString, total, cardNum], function (err, result) {
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

    getCustomerIdByEmail: function (customer_email, callback) {
        //get connection
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {
                const sql = "SELECT customer_id FROM bed_dvd_db.customer where customer.email = ?;"
                //execute sql command
                conn.query(sql, [customer_email], function (err, result) {
                    conn.end()
                    if (err) {
                        //if an error occurs, console log the error for debugging purposes
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

    getCustomersReviews: function (customer_id, callback) {
        //get connection
        const conn = db.getConnection()
        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if an error occurs, console log for debugging purposes
                console.log(err)
                return callback(err, null)
            } else {
                const sql = "SELECT * FROM bed_dvd_db.reviews where reviewer_id = ?;"
                //execute sql command
                conn.query(sql, [customer_id], function (err, result) {
                    conn.end()
                    if (err) {
                        //if an error occurs, console log the error for debugging purposes
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

    deleteReview: function(rating_id, callback) {
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
                        var sql = 'Delete from reviews where rating_id=?';
                        //execute the sql command
                        conn.query(sql, [rating_id], function (err, result) {
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
    }
}

module.exports = customerDB;