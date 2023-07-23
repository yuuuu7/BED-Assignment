var jwt = require('jsonwebtoken');
var express = require('express');
var config = require('../config');
var app = express()
var cookieParser = require('cookie-parser')
app.use(cookieParser())


function verifyToken(req, res, next){

    var token = req.cookies; //retrieve authorization header's content
    console.log(token);

    if(!token){ //process the token
    
       res.status(403);
       return res.send({auth:'false', message:'Not authorized!'});
    }else{s

    //console.log(token);
       jwt.verify(token, config.key, function(err, decoded){ //verify token
        if(err){
            res.status(403);
            return res.end({auth:false, message:'Not authorized!'});
        }else{
            req.userid=decoded.userid; //decode the userid and store in req for use
            req.role = decoded.role; //decode the role and store in req for use
            next();
        }
       });
    }
}

module.exports = verifyToken;