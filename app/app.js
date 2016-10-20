'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// added
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

var connection = require('./connection');
var routes = require('../routes/index');
var users = require('../routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); // another alternative is combined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// added
app.use(session({
  secret: 'keyboard cat',
  resave: false, //don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  store: new MongoStore({
    mongooseConnection: connection,
    ttl: 5 * 60 // session duration is 5 minutes
  }),
  proxy : true,
  cookie: {secure: true}
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);
app.use('/users', users);

// added
// passport config
var Account = require('../models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("Handling not found");
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log("handling error in dev; rendering error with stacktrace");
    // console.log(req);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("handling error; rendering error without stacktrace");
  // console.log(req);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
