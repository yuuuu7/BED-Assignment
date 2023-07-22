const express = require("express");
const app = express();
var serveStatic = require('serve-static');
const authenticateUser = require('./isLoggedInMiddleware')


// Use the middleware to protect the routes
app.get("/", (req, res) => {
  res.sendFile("/public/landing.html", { root: __dirname });
});

// Other routes that require authentication
// ...

// Use the middleware to protect the login route as well (optional, but good practice)
app.get("/login", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/explore", (req,res) => {
    res.sendFile("/public/home.html", { root: __dirname })
})

// Serving static files (public directory) - No need for authentication
app.use(serveStatic(__dirname + '/public'));

const PORT = 3001;

app.listen(PORT, () => {
console.log(`Client server has started listening on port ${PORT}`);
});