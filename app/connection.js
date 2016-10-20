'use strict';

var debug = require('debug')('VotingApp:connection');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mongoUrl = process.env.MONGO_URI;
var connection = mongoose.createConnection(mongoUrl);

connection.on('error', function(err){
  if(err)
    throw err;
});

connection.once('open', function callback () {
  debug('Mongo db connected successfully');
});

module.exports = connection;