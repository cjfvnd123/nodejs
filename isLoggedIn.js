function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
      // If the user is logged in (session contains user data), proceed to the next middleware
      return next();
    } else {
      // If the user is not logged in, redirect them to the login page
      res.redirect('/login');
    }
  }
  
  module.exports = isLoggedIn;
  