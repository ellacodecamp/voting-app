'use strict';

var debug = require("debug")("VotingApp:account");
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var connection = require('./connection');
var passportGitHubMongoose = require('./passport-github-mongoose');

var Account = new Schema({
  username: String,
  displayName: String
});

Account.plugin(passportLocalMongoose);
Account.plugin(passportGitHubMongoose);

module.exports = connection.model('Account', Account);