'use strict';

var debug = require('debug')('VotingApp:routes:index');
var express = require('express');
var passport = require('passport');
var connection = require('../app/connection');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function (req, res) {
  debug("serving GET /; returning index");
  debug(req.user);
  res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
  debug("serving GET /register; returning register");
  res.render('register', { });
});

router.post('/register', function(req, res, next) {
  debug("serving POST /register; returning register on failure, redirect to / on success");
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      debug(account);
      return res.render('register', { error : err.message });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  debug("serving GET /login; returning login");
  // no user on login page
  res.render('login', { user : req.user, error : req.flash('error') });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
  debug("serving POST /login; redirect to /");
  res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  debug("serving GET /logout; redirect to /");
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res){
  debug("serving GET /ping; returning pong");
  res.status(200).send("pong!");
});

module.exports = router;