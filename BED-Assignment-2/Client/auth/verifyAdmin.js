function checkRole(req, res, next) {
  

  const role = req.role;

  if (role.toLowerCase() !== "admin") {
    res.redirect('/403');
  } else {
    req.role = role;
    next();
  }

}

module.exports = checkRole;