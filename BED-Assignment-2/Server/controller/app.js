var express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require("cors")
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);
app.use(cors())
app.use(cookieParser())


const User = require('../model/user')
const Category = require('../model/category')
const Platform = require('../model/platform')
const Game = require('../model/game');
const Review = require('../model/review');
const verifyToken = require('../auth/verifyToken')


var serveStatic = require('serve-static');
// Serving static files (public directory)
app.use(serveStatic(__dirname + '/public'));
app.use(cookieParser())




//============================================================== Category API ===============================================================================

// Insert a new category
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

app.get('/category', (req,res) => {

  Category.retrieveAllCatNames((err,results) => {

    if(err) {
      res.status(500).send()
      return
    }

    res.status(200).send(results)
  })
})

app.get('/category/catId', (req,res) => {

  var category_name = req.query.catname

  Category.retrieveCatId(category_name, (err,results) => {

    if(err) {
      res.status(500).send()
      return
    }

    res.status(200).send(results)
  });
})

//============================================================== Platform API ===============================================================================

// Insert a new platform
app.post('/platform', (req, res) => {
  console.log(req.body)
  Platform.insertNewPlatform(req.body, (err, results) => {
    if (err) {
      if (err === "Platform already exists") {
        res.status(422).send("Platform already exists");
        return
      } else {
        res.status(500).send("Internal Server Error");
        return
      }
      return;
    }

    res.status(201).send();
  });
});

app.get('/platform', (req,res) => {
  Platform.getAllPlatformNames((err,results) => {
    if(err) {
      console.log(err)
      res.status(500).send()
      return
    }

    res.status(200).send(results)
  })
})

app.get('/platform/platformId', (req,res) => {

  Platform.retrievePlatformId(req.query.name, (err,results) => {
    if (err) {
      res.status(500).send()
      return
    }
    res.status(200).send(results)
  })
});

//============================================================== Game APIs ===============================================================================

// Insert a new game
const multer = require('multer')
const path = require('path')
var db=require('../db/databaseConfig');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../Client/public/images'); // Specify the destination folder where the uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Specify the filename for the uploaded file
    }
  });

const fileFilter = function (req, file, cb) {
    // Accept only JPG images
    if (file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only JPG images are allowed'), false);
    }
  };
  
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  });


app.post('/game', upload.single('image'), (req, res) => {

  if(req.file !== undefined) {
    var imageName = req.file.filename;
  } else {
    var imageName = null;
  }

  Game.insertNewGame(req.body, imageName, (err, results) => {
      if (err) {
          if (err === 'Invalid price format') {
            res.status(400).send("Invalid price format");
  
          } else if (err === "Invalid platformid format" || err === "Invalid categoryid format") {
              res.status(400).send("Invalid format for platformid or categoryid");
  
          } else if (err === "Invalid platformid(s)" || err === "Invalid categoryid(s)") {
              res.status(404).send("One or more platformid(s) or categoryid(s) do not exist");
  
          } else if (err === "Prices and Platforms do not match") {
            res.status(400).send("Total number of Prices in relation to Platforms do not match");
  
          } else if (err === "Game already exists") {
            res.status(400).send("Game already exists");
  
          } else {
              console.log(err)
              res.status(500).send("Internal Server Error");
          }
          return;
      }
  
      res.status(201).send({"gameid": results});
  });
  });


// Get game by platform ID
app.get('/game/byPlatformName', (req,res) => {

  var platform_name = req.query.platform_name

  Game.getGameByPlatform(platform_name, (err,results) => {

      if(err) {
          res.status(500).send()
          return
      }

      if(results.length === 0) {
          res.status(404).send()
          return
      }

      res.status(200).send(results)
  })
})

// Delete game by ID
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

// Update game by ID
app.put('/game/:gameid', upload.single('image'), (req,res) => {

  if(req.file !== undefined) {
    var imageName = req.file.filename;
  } else {
    var imageName = null;
  }

  var gameid = req.params.gameid
  Game.updateGameByID(req.body, gameid, imageName, (err,results) => {
    if (err) {
      if (err === 'Invalid price format') {
        res.status(400).send("Invalid price format");

      } else if (err === "Invalid platformid format" || err === "Invalid categoryid format") {
          res.status(400).send("Invalid format for platformid or categoryid");

      } else if (err === "Invalid platformid(s)" || err === "Invalid categoryid(s)") {
          res.status(404).send("One or more platformid(s) or categoryid(s) do not exist");

      } else if (err === "Prices and Platforms do not match") {
          res.status(400).send("Total number of Prices in relation to Platforms do not match");
      } else {
          console.log(err)
          res.status(500).send("Internal Server Error");
      }
      return;
  }

      res.status(204).send('Successfully updated game')
  })
})

app.get('/game/allGameNames', (req,res) => {
  
  Game.getAllGameNames((err,results) => {
    if(err) {
      console.log(err)
      res.status(500).send()
      return
    }

    res.status(200).send(results)
  })
});

app.get('/getGameByID/game/:id', (req,res) => {

  const gameid = req.params.id
  
  Game.getGameByID(gameid, (err,results) => {
    if(err) {
      console.log(err)
      res.status(500).send()
      return
    }

    res.status(200).send(results)
  });
})

app.get('/game/allplatforms/', (req,res) => {

  Game.getAllGamesPlatform(req.query.search, (err,results) => {
    if(err) {
      console.log(err)
      res.status(500).send()
      return
    }

    res.status(200).send(results)
  })
});

app.get('/game/id/:id', (req,res) => {

  var gameid = req.params.id

  Game.getGameByID(gameid, (err,results) => {
    if(err) {
      res.status(500).send()
    }

    res.status(200).send(results)
  })
})

app.get('/game/selectByName/', (req,res) => {
  
    Game.gameSelectByName(req.query.option, (err,results) => {
      if(err) {
        console.log(err)
        res.status(500).send()
        return
      }
  
      res.status(200).send(results)
    })
})

//============================================================== Review APIs ===============================================================================

// Add a new review for a game
app.post('/user/:uid/game/:gid/review/', (req, res) => {
var userid = req.params.uid;
var gameid = req.params.gid;

Review.insertNewReview(userid, gameid, req.body, (err, results) => {
  if (err) {
    if (err === "Rating should be a valid integer.") {
      res.status(400).send("Rating should be a valid integer");
    } else if(err === "User has already left a review for this game") {
      res.status(400).send("User has already left a review for this game");
    } else {
      res.status(500).send();
    }
    return;
  }

  res.status(201).send({ "reviewid": results });
});
});

// Get reviews for a game by game ID
app.get('/game/:id/review', (req,res) => {
  var gameid = req.params.id

  Review.getReviewByGameID(gameid, (err,results) => {
      if(err){
          res.status(500).send()
          return
      }


      res.status(200).send(results)
  })
})

  
module.exports = app;

//============================================================== Login/Logout APIs ===============================================================================

app.post('/user/login',function(req, res){
  var email=req.body.email;
  var password = req.body.password;

  User.loginUser(email, password, function(err, token, result){
      if(!err){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Authorization', token)
        delete result[0]['password'];//clear the password in json data, do not send back to client
        console.log(result);
        res.json({success: true, UserData: result, token:token, status: 'You are successfully logged in!'}); 
        res.send();
  } else{
      res.status(501)
      res.send(err);
      }
  }); 
}); 

