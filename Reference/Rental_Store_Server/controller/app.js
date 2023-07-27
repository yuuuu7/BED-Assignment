var user = require('../model/login.js');
var film = require('../model/film')
var verifyToken = require('../auth/verifyToken.js');
var checkRole = require('../auth/verifyAdmin')
const cors = require('cors');
const express = require("express")
const bodyParser = require("body-parser")
const actor = require("../model/actors")
const category = require('../model/category');
const customer = require("..//model/customer")
const staff = require("../model/staff")
const store = require("../model/store")
const cities = require("../model/city")
//create the web server 
const app = express()

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    user.login(email, password, function (err, token, result) {
        if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password'];//clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
            res.send();
        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    });
});


app.get('/films', function (req, res) {
    var filmTitle = req.query.filmTitle
    var maxPrice = parseInt(req.query.maxPrice)
    var catName = req.query.catName

    film.getFilms(filmTitle, maxPrice, catName, function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send(null);
        }
    });
})


app.get('/categories', function (req, res) {
    film.getAllCategories(function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send(null);
        }
    });
})

app.get("/film/actors", function (req, res) {
    var film_id = parseInt(req.query.film_id)

    actor.getActorsForFilm(film_id, function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send(null);
        }
    });
})

app.get("/store/address", function (req, res) {

    store.getStoreAddresses(function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send(null);
        }
    });
})

app.get("/cities", function (req, res) {

    cities.getCities(function (err, result) {
        if (!err) {
            console.log(result)
            res.send(result)
        } else {
            res.status(500).send(err)
        }
    })

})

app.post("/customer/purchase", verifyToken, function (req, res) {
    const customer_id = req.body.customer_id
    const cardNum = req.body.cardNum
    const cartString = req.body.cartString
    const total = req.body.total

    customer.confirmOrder(customer_id, cardNum, cartString, total, function () {

    })

})

app.get("/customer/email", verifyToken, function (req, res) {
    const email = req.query.email

    customer.getCustomerIdByEmail(email, function (err, result) {
        if (!err) {
            console.log(result);
            res.status(200)
            res.send(result);
        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    });
})

app.get("/film", function (req, res) {
    const film_id = req.query.film_id

    film.getFilmbyId(film_id, function (err, result) {
        if (!err) {
            console.log(result);
            res.status(200)
            res.send(result);
        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    });
})

app.post("/film/review", verifyToken, function (req, res) {
    const title = req.body.title
    const review_text = req.body.review_text
    const review_number = req.body.review_number
    const email = req.body.email

    film.addFilmReview(title, review_text, review_number, email, function (err, result) {
        if (!err) {
            console.log(result);
            res.status(200)
            res.send(result);
        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    });
})

app.get("/films/language", function (req, res) {
    film.getAllLangs(function (err, result) {
        if (!err) {
            console.log(result)
            res.status(200)
            res.send(result)
        } else {
            res.status(500)
            res.send(err)
        }
    })
})

app.get("/films/reviews", function (req, res) {
    const film_id = req.query.film_id

    film.getAllReviews(film_id, function (err, result) {
        if (!err) {
            console.log(result)
            res.status(200)
            res.send(result)
        } else {
            res.status(500)
            res.send(err)
        }
    })
})

app.get("/customer/reviews", function (req, res) {
    const customer_id = req.query.customer_id

    customer.getCustomersReviews(customer_id, function (err, result) {
        if (!err) {
            console.log(result)
            res.status(200)
            res.send(result)
        } else {
            res.status(500)
            res.send(err)
        }
    })
})


app.post("/films", function (req, res) {
    const store_id = req.body.store_id
    const title = req.body.title
    const description = req.body.description
    const release_year = req.body.release_year
    const language_id = req.body.language_id
    const rental_duration = req.body.rental_duration
    const rental_rate = req.body.rental_rate
    const length = req.body.length
    const replacement_cost = req.body.replacement_cost
    const rating = req.body.rating
    const special_features = req.body.special_features  
    const category_name = req.body.category_name
    var base64data = req.body.image;

    film.addFilm(title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, base64data, category_name, store_id, function (err, result) {
        if (err) {
            //if there is any other error
            res.status(500).send({ "error_msg": "Internal server error" })
        } else {
            //if the proccess is successful
            res.status(201).send({ "film": result.insertId })
        }
    })
})

app.delete("/review/delete", function (req, res) {
    const rating_id = req.body.rating_id;

    customer.deleteReview(rating_id, function (err, result) {
        if (err) {
            //console log any error for debugging purposes
            console.log(err);
            res.status(500).send({ "error_msg": "Internal server error" });
        } else if (result.affectedRows === 0) {
            //if the record of the given actor id cannot be found
            res.status(204).send(err)
        } else {
            //no errors, success
            res.status(200).send({ "success_msg": "review deleted" });
        }
    });
})

//ENDPOINT 3 ---------------------------------------------------------------------------------
app.post('/actors/', verifyToken, checkRole, function (req, res) {
    //get parameters from the body object
    const first_name = req.body.first_name
    const last_name = req.body.last_name

    //runs addActor function
    actor.addActor(first_name, last_name, function (err, result) {
        if (first_name == null || last_name == null) {
            //if information is missing from the body object
            res.status(400).send({ "error_msg": "missing data" })
        } else if (err) {
            //if there is any other error
            res.status(500).send({ "error_msg": "Internal server error" })
        } else {
            //if the proccess is successful
            res.status(201).send({ "actor_id": result.insertId })
        }
    })

})

//ENDPOINT 6 -------------------------------------------------------------------------------------------

app.get("/film_categories/:category_id/films/", function (req, res) {
    // get the category_id value from the url
    const category_id = req.params.category_id;

    category.getFilmByCategoryID(category_id, function (err, result) {
        if (err) {
            //if there is an error, console log for easier debugging
            console.log(err);
            res.status(500).send({ "error_msg": "Internal server error" });
        } else {

            //if no errors
            res.status(200).send(result);
        }
    });

})

//ENDPOINT 7 ---------------------------------------------------------------------------------------------------------

app.get("/customer/:customer_id/payment/", function (req, res) {
    // get the category_id value from the url
    const customer_id = req.params.customer_id;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    customer.getPaymentDetails(customer_id, start_date, end_date, function (err, result) {
        // customer.getPaymentDetails(customer_id, start_date, end_date, function (err, result) {
        if (err) {
            //if there is an error, console log for easier debugging
            console.log(err);
            res.status(500).send({ "error_msg": "Internal server error" });
        } else {
            //if no errors
            var total = 0;
            for (k = 0; k < result.length; k++) {
                total += result[k].amount;
            }
            res.status(200).send({ "rental": result, "total": total.toFixed(2) });
        }
    });

})

//ENDPOINT 8 ---------------------------------------------------------------------------------------------------------------

app.post('/customers/', verifyToken, function (req, res) {
    //get parameters from the body object
    const store_id = req.body.store_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const address = req.body.address;

    //runs addActor function
    customer.addCustomer(store_id, first_name, last_name, email, address, function (err, result) {
        if (first_name == null || last_name == null || store_id == null || address == null || email == null) {
            //if information is missing from the body object
            res.status(400).send({ "error_msg": "missing data" })
        } else if (err) {
            if (err.errno == 1062) {
                //if email entered already exists
                res.status(409).send({ "error_msg": "email already exist" })
            }
            else {
                //if there is any other error
                res.status(500).send({ "error_msg": "Internal server error" })
            }
        } else {
            //if the proccess is successful
            res.status(201).send({ "customer_id": result.insertId })
        }
    })

})

//ENDPOINT 10 ---------------------------------------------------------------------------------

app.post('/staff/', function (req, res) {
    //get parameters from the body object
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const address = req.body.address;
    const store_id = req.body.store_id;
    const username = req.body.username;
    const password = req.body.password;

    //runs addStaff function
    staff.addStaff(first_name, last_name, email, address, store_id, username, password, function (err, result) {
        if (first_name == null || last_name == null || store_id == null || address == null || email == null) {
            //if information is missing from the body object
            res.status(400).send({ "error_msg": "missing data" })
        } else if (err) {
            //if there is any other error
            res.status(500).send({ "error_msg": "Internal server error" })
        } else {
            //if the proccess is successful
            res.status(201).send({ "staff": result.insertId })
        }
    })

})



module.exports = app;