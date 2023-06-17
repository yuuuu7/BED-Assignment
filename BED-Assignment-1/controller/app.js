var express = require('express');
var bodyParser = require('body-parser');

var app = express();


var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);

const User = require('../model/user')
const Category = require('../model/category')
const Platform = require('../model/platform')
const Game = require('../model/game');
const Review = require('../model/review');

//============================================================== User APIs ===============================================================================
app.get('/users/', (req,res) => {
    User.getAllUsers((err,results) => {
        if(err) {
            res.status(500).send()
            return
        }

        if(results.length === 0) {
            res.status(404).send()
        }

        res.status(200).send(results)
    })
})

app.post('/users/', (req,res) => {
    User.addNewUser(req.body, (err,results) => {
        if (err) {
            if (err === "Email already exists") {
              res.status(422).send("Email already exists");
            } else {
              res.status(500).send("Internal Server Error");
            }
            return;
          }

        res.status(201).send({"userID": results})
    })
})

app.get('/users/:userid', (req,res) => {

    var userid = req.params.userid

    User.findUserByID(userid, (err,results) => {
        if (results.length === 0) {
            return res.status(404).send('Data not found');
          }

        if(err) {
            res.status(500).send()
            return
        }

        res.status(200).send(results)
    })
})

//============================================================== Category API ===============================================================================
app.post('/category', (req, res) => {
    Category.insertNewCat(req.body, (err, results) => {
      if (err) {
        if (err === "Category already exists") {
          res.status(422).send("Category already exists");
        } else {
          res.status(500).send("Internal Server Error");
        }
        return;
      }
  
      res.status(201).send();
    });
});

//============================================================== Platform API ===============================================================================
app.post('/platform', (req, res) => {
    Platform.insertNewPlatform(req.body, (err, results) => {
      if (err) {
        if (err === "Platform already exists") {
          res.status(422).send("Platform already exists");
        } else {
          res.status(500).send("Internal Server Error");
        }
        return;
      }
  
      res.status(201).send();
    });
});

//============================================================== Game APIs ===============================================================================
app.post('/game', (req,res) => {
    Game.insertNewGame(req.body, (err,results) => {
        if(err) {
            res.status(500).send("Internal Server Error")
            return
        }

        res.status(201).send({"gameid": results})
    });
});


app.get('/game/:platformid', (req,res) => {

    var platformid = req.params.platformid

    Game.getGameByPlatform(platformid, (err,results) => {

        if(err) {
            res.status(500).send()
            return
        }

        if(results.length === 0) {
            res.status(404).send()
        }

        res.status(200).send(results)
    })
})


app.delete('/game/:gameid', (req,res) => {

    var gameid = req.params.gameid
    Game.deleteGameByID(gameid, (err,results) => {
        if(err) {
            res.status(500).send()
            return
        }

        res.status(204).send()
    })
})

app.put('/game/:gameid', (req,res) => {

    var gameid = req.params.gameid
    Game.updateGameByID(req.body, gameid, (err,results) => {
        if(err) {
            res.status(500).send()
            return
        }

        res.status(204).send()
    })
})

//============================================================== Review APIs ===============================================================================
app.post('/user/:uid/game/:gid/review/', (req,res) => {

    var userid = req.params.uid
    var gameid = req.params.gid

    Review.insertNewReview(userid, gameid, req.body, (err,results) => {
        if(err) {
            res.status(500).send()
            return
        }

        res.status(201).send({"reviewid": results})
    })
})

app.get('/game/:id/review', (req,res) => {
    var gameid = req.params.id

    Review.getReviewByGameID(gameid, (err,results) => {
        if(err){
            res.status(500).send()
            return
        }

        if(results.length === 0) {
            res.status(404).send()
        }

        res.status(200).send(results)
    })
})
  
module.exports = app;

//End