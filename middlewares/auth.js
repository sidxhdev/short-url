const { getUser } = require("../service/auth");

// Middleware to restrict access to only logged-in users
function restrictToLoggedinUserOnly(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) return res.redirect("/login");

  const user = getUser(token);
  if (!user) return res.redirect("/login");

  req.user = user;
  next();
}

// Middleware to optionally attach user if logged in (e.g. for UI)
function checkAuth(req, res, next) {
  const token = req.cookies?.jwt;
  
  const user = getUser(token);
  req.user = user; // Will be `null` if invalid

  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
};
