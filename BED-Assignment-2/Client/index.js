const express = require("express");
const app = express();
var serveStatic = require('serve-static');
const verifyToken = require('./auth/verifyToken')
const cookieParser = require('cookie-parser')
const verifyAdmin = require('./auth/verifyAdmin')
const isLoggedin = require('./auth/isLoggedin')
app.use(cookieParser())


app.get("/", (req, res) => {
  res.sendFile("/public/html/landing.html", { root: __dirname });
});

app.get("/profile", verifyToken, (req, res) => {
  res.sendFile("/public/html/profile.html", { root: __dirname });
});


app.get("/login", isLoggedin, (req, res) => {
  res.sendFile("/public/html/login.html", { root: __dirname });
});

app.get("/explore", (req,res) => {
    res.sendFile("/public/html/explore.html", { root: __dirname })
})

app.get("/signup", (req,res) => {
  res.sendFile("/public/html/signup.html", { root: __dirname })
})

app.get("/403", (req,res) => {
  res.sendFile("/public/html/403.html", { root: __dirname })
})

app.get("/gameinfo", verifyToken, (req,res) => {
  res.sendFile("/public/html/gameinfo.html", { root: __dirname })
})

app.get("/admin", verifyToken, verifyAdmin, (req,res) => {
  res.sendFile("/public/html/admin.html", { root: __dirname })
})

// Serving static files (public directory) - No need for authentication
app.use(serveStatic(__dirname + '/public'));
app.use(serveStatic(__dirname + '/public/images'));

const PORT = 3001;

app.listen(PORT, () => {
console.log(`Client server has started listening on port ${PORT}`);
});