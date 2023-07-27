var jwt = require('jsonwebtoken');
var config = require('../config');

function checkRole(req, res, next) {
  console.log(req.headers);

  const role = req.headers['role']; //retrieve authorization header's content

  if (role !== "admin") {
    res.status(403);
    return res.json({ auth: false, message: 'Not authorized!' });
  } else {
    req.role = role;
    next();
  }

}

module.exports = checkRole;