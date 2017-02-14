var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// for easyID OIDC integration
const passport = require('passport');
const OpenIdStrategy = require('passport-openidconnect').Strategy;
const expressSesssion = require('express-session');

// These two only if you want to verify issued id_token
const jsonwebtoken = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var strategy = new OpenIdStrategy({ 
    issuer: 'https://' + process.env.DOMAIN,
    authorizationURL: 'https://' + process.env.DOMAIN + '/oauth2/authorize', 
    tokenURL: 'https://' + process.env.DOMAIN + '/oauth2/token', 
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL:  process.env.CALLBACK_URL || 'http://localhost:3000/callback',
    acr_values: 'urn:grn:authn:no:bankid:central',  // Pick one of the supported authentication methods
    skipUserProfile: true  // there is no userInfo endpoint on easyID 
  }, function(iss, sub, profile, jwtClaims, accessToken, refreshToken, params, done) {
    // To verify signature on the params.id_token, uncomment
    // and add the verification function shown further down.
    // return verifySignature(params.id_token, done);
    return done(null, jwtClaims);
  });

function verifySignature(id_token, done) {
  // no error checking: push on or fail miserably
  const jwksClient = jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://' + process.env.DOMAIN + '/.well-known/jwks'
  });
  const jwt_header = JSON.parse(new Buffer(id_token.split('.')[0], 'base64').toString());
  jwksClient.getSigningKey(jwt_header.kid, (err, key) => {
    var signingKey = key.publicKey || key.rsaPublicKey;
    jsonwebtoken.verify(id_token, signingKey, function (err, userInfo) {
      done(err, userInfo);
    });
  });
}

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(expressSesssion({ secret: 'Some secret you say?', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
