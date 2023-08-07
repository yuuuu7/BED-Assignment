var jwt = require('jsonwebtoken');
var express = require('express');
var config = require('../config');
var app = express()
var cookieParser = require('cookie-parser')
app.use(cookieParser())


function verifyToken(req, res, next){

    const token = req.cookies.token
    
    if(!token){ //process the token
    
        next();
    } else {
        return res.redirect('/profile');
    }

    
    
}

module.exports = verifyToken;