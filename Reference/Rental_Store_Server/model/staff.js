var db = require('./databaseConfig')

var staffDB = {
    updateStaffName: function (rental_id, first_name, last_name, callback) {
        //get connection
        var conn = db.getConnection();

        //connect to database
        conn.connect(function (err) {
            if (err) {
                //if there is an error when trying to get connection
                console.log(err);
                return callback(err, null)
            } else if (last_name == null) {
                const sql = "Update staff, rental set staff.first_name=? where rental_id=? and staff.staff_id=rental.staff_id;"

                //execute sql command
                conn.query(sql, [first_name, rental_id], function (err, result) {
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
                const sql = "Update staff, rental set staff.last_name=? where rental_id=? and staff.staff_id=rental.staff_id;"

                //execute xql command
                conn.query(sql, [last_name, rental_id], function (err, result) {
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
                const sql = "Update staff, rental set staff.first_name=?, staff.last_name=? where rental_id=? and staff.staff_id=rental.staff_id;"

                //execute xql command
                conn.query(sql, [first_name, last_name, rental_id], function (err, result) {
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


        })

    },

    addStaff: function(first_name, last_name, email, address, store_id, username, password, callback) {
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
                                //if no errors, execute sql code to enter data into staff table
                                const sql2 = "INSERT into bed_dvd_db.staff(first_name, last_name, address_id, email, store_id, username, password) values (?,?,?,?,?,?,?)"
        
                                conn.query(sql2, [first_name, last_name, result.insertId, email, store_id, username, password], function (err, result) {
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
            }
        
} 



module.exports = staffDB;