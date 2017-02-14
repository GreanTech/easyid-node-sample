var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

router.get('/', ensureLoggedIn, function(req, res, next) {
  console.log(req.user);
  res.render('users', req.user);  // display user info
});

module.exports = router;