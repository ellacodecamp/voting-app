'use strict';

var debug = require("debug")("VotingApp::models::passportGitHubMongoose");
var generaterr = require('generaterr');
var GitHubStrategy = require('passport-github2').Strategy;

module.exports = function(schema, options) {

  var AuthenticationError = generaterr('AuthenticationError');

  schema.add({
    githubId: String,
    githubName: String
  });

  schema.statics.authenticateGitHub = function() {
    var self = this;

    return function(token, refreshToken, profile, done) {
      // console.log("passport-github-mongoose: authenticate return function");
      // debug(token);
      // debug(refreshToken);
      // debug(profile);
      var query = self.findOne({githubId: profile.id});
      query.exec(function(err, user) {
        if (err) {
          return done(err);
      	}

      	if (user) {
      	  return done(null, user);
      	} else {
          var newUser = new self();

          var displayName = profile.displayName || profile.username;
      	  newUser.githubId = profile.id;
      	  newUser.githubName = profile.username;
      	  newUser.displayName = displayName;

      	  newUser.save(function (err) {
      	    if (err) {
        		  done(err);
      	    }

      	    return done(null, newUser);
      	  });
        }
      });
    }
  };

  // these two functions will identify if we are dealing with github case or not
  // and will serialize accordingly
  schema.statics.serializeGitHubUser = function() {
    return function(user, cb) {
      // console.log("serialize user " + user);
      var userObject = {};
      userObject.username = user.get("username");
      userObject.githubId = user.get("githubId");
      cb(null, userObject);
    };
  };

  schema.statics.deserializeGitHubUser = function() {
    var self = this;

    return function(user, cb) {
      // console.log("deserialize user " + user);
      if (user.username) {
        self.findByUsername(user.username, cb);
      } else if (user.githubId) {
        var query = self.findOne({githubId: user.githubId});
        query.exec(cb);
      } else {
        cb(new AuthenticationError("User is incorrectly identified by the session"), null);
      }
    };
  };

  schema.statics.createStrategy = function(options) {
    return new GitHubStrategy(options, this.authenticateGitHub());
  };
};