var express = require('express');
var router = express.Router();

// needed to make authentication work
var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// initiate the login process
router.get('/login',
  passport.authenticate('openidconnect'), 
  function(req, res){
    res.render('login', { env: env });
  });
  
// complete the login process
router.get('/callback',
  passport.authenticate('openidconnect', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/users'); // success!
  });

module.exports = router;
