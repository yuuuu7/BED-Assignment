const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config');

var check = (req,res,next) => {
    const authHeader = req.headers.authorization
    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        // If the user is not authenticated and not on the login page, redirect them to the login page
        if (req.originalUrl !== '/login') {
            return res.redirect("/login");
        }
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, {algorithms: ["HS256"] }, (err, decodedToken) => {
        if(err) {
            res.status(401).send()
            return
        }
        req.decodedToken = decodedToken;
        next();
    });
}

module.exports=check;