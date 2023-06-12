var express = require('express');
var bodyParser = require('body-parser');

var app = express();


var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);

const User = require('../model/user')

app.get('/users/', (req,res) => {
    User.getAllUsers((err,results) => {
        if(err) {
            res.status(500).send()
            return
        }

        res.status(200).send(results)
    })
})

app.post('/users/', (req,res) => {
    User.addNewUser(req.body, (err,results) => {
        if(err) {
            res.status(500).send()
            return
        }

        res.status(201).send({"userID": results})
    })
})


module.exports = app;