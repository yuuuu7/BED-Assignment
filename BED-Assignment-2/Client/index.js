const express = require("express");
const app = express();
var serveStatic = require('serve-static');


app.get("/", (req, res) => {
res.sendFile("/public/landing.html", { root: __dirname });
});

app.get("/login", (req, res) => {
    res.sendFile("/public/login.html", { root: __dirname });
    });

app.use(serveStatic(__dirname + '/public')); 

const PORT = 3001;

app.listen(PORT, () => {
console.log(`Client server has started listening on port ${PORT}`);
});