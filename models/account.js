'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connection = require('../app/connection');
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);

module.exports = connection.model('Account', Account);