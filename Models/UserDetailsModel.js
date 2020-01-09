'use strict'
var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var UserDetailsSchema = new Schema({
  uniqueId: {
    type: String,
    required: "Please provide user id"
  },
  firebaseId: {
    type: String,
    required: "Please provide user id"
  },
  username: {
    type: String,
    required: "Please provide user name"
  }
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
