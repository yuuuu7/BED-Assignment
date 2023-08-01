var jwt = require('jsonwebtoken');
var express = require('express');
var config = require('../config');
var app = express()
var cookieParser = require('cookie-parser')
app.use(cookieParser())


function verifyToken(req, res, next){

    const token = req.cookies.token
    
    if(!token){ //process the token
    
        return res.redirect('/login');
    }

    jwt.verify(token, config.key, function(err, decoded){ //verify token
      
    if(err){

        res.redirect('/403')

    } else{
        
        req.role = decoded.role;
        req.id = decoded.id;
        req.decoded = decoded;
        
        next();
    }
    });
    
}

module.exports = verifyToken;