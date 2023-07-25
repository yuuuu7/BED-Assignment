const express = require("express");
const app = express();
var serveStatic = require('serve-static');
const verifyToken = require('./auth/verifyToken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())


app.get("/", (req, res) => {
  res.sendFile("/public/html/landing.html", { root: __dirname });
});

app.get("/profile", verifyToken, (req, res) => {
  res.sendFile("/public/html/profile.html", { root: __dirname });
});

// Use the middleware to protect the login route as well (optional, but good practice)
app.get("/login", (req, res) => {
  res.sendFile("/public/html/login.html", { root: __dirname });
});

app.get("/explore", verifyToken, (req,res) => {
    res.sendFile("/public/html/home.html", { root: __dirname })
})

app.get("/403", (req,res) => {
  res.sendFile("/public/html/403.html", { root: __dirname })
})

// Serving static files (public directory) - No need for authentication
app.use(serveStatic(__dirname + '/public'));

const PORT = 3001;

app.listen(PORT, () => {
console.log(`Client server has started listening on port ${PORT}`);
});