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

// Get all users
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

// Add a new user
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

// Get user by ID
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

//============================================================== Platform API ===============================================================================

// Insert a new platform
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

// Insert a new game
app.post('/game', (req, res) => {
Game.insertNewGame(req.body, (err, results) => {
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
app.get('/game/:platformid', (req,res) => {

  var platformid = req.params.platformid

  Game.getGameByPlatform(platformid, (err,results) => {

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
app.put('/game/:gameid', (req,res) => {

  var gameid = req.params.gameid
  Game.updateGameByID(req.body, gameid, (err,results) => {
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

      res.status(204).send()
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

      if(results.length === 0) {
          res.status(404).send()
      }

      res.status(200).send(results)
  })
})

  
module.exports = app;


//============================================================== Bonus Feature APIs ===============================================================================
const multer = require('multer')
const path = require('path')
var db=require('../model/databaseConfig');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'controller/images/'); // Specify the destination folder where the uploaded files will be stored
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
    limits: { fileSize: 1024 * 1024 }, // Set 1MB limit
    fileFilter: fileFilter
  });

app.post('/upload/game/:id/image', upload.single('image'), function (req, res) {
  var gameid = req.params.id
  // Access the uploaded file name
  const imageName = req.file.originalname;

  Game.addImageName(imageName, gameid, (err,results) => {
    if(err) {
      res.status(500).send()
      return
    }
  
    res.status(201).send(`Successfully uploaded ${imageName}`)
  })
});
  
app.get("/upload/game/:id/image", function (req, res) {
  var gameid = req.params.id
  res.sendFile(path.join(__dirname, "upload.html"));
});

app.get('/game/:id/image', (req,res) => {
  var gameid = req.params.id

  Game.retrieveImage(gameid, (err,results) => {
    if(err) {
      res.status(500).send()
      return
    }

    if(results.length === 0) {
      res.status(404).send(`The picture for game with ID ${gameid} does not exist!`)
      return
    }

    const imageName = results[0].image_name;
    const absoluteImagePath = path.join(__dirname, 'Images', imageName);

    res.sendFile(absoluteImagePath);
  })
})

app.post('/game/:id/image', (req,res) => {
  var gameid = req.params.id
  Game.addImageName(req.body, gameid, (err,results) => {
    if(err) {
      res.status(500).send()
      return
    }
  
    res.status(201).send()
  })
})

app.get('/game', (req,res) => {
  Game.getAllGames((err,results) => {
    if(err) {
      res.status(500).send()
    }

    res.status(200).send(results)
  })
})

app.get('/game/id/:id', (req,res) => {

  var gameid = req.params.id

  Game.getGameByID(gameid, (err,results) => {
    if(err) {
      res.status(500).send()
    }

    res.status(200).send(results)
  })
})

app.use('/images', express.static(path.join(__dirname, 'images')));


//End