"use strict";
var mongoose = require("mongoose");
const userDetails = mongoose.model("UserDetails");
const chat_port = process.env.CHAT_PORT || 4000;
const io = require("socket.io")(chat_port);
const socketAuth = require("socketio-auth");

// Fetch all users
var users = {};

var uI; 

io.on("connection", socket => {
  uI = socket.id;
});

userDetails.find({}, (err, mongoUsers) => {
  if (err) 
    console.log(err);
    
  mongoUsers.map(value => {
    if (value) {
      const { uniqueId, firebaseId, name } = value;
      users[uniqueId] = name;
    }

    io.on("connection", socket => {
      const id = socket.id;
      socket.emit("join-alert", "You Joined");
  
      socket.on("send-chat-message", message => {
        let name = users[id];
        const data = { name, message };
        socket.broadcast.emit("chat-message", data);
      });
  
      socket.on("user-joined", name => {
        users[socket.id] = name;
        socket.broadcast.emit("user-connected", name);
      });
  
      socket.on("disconnect", () => {
        let name = users[id];
        socket.broadcast.emit("user-disconnected", name);
        delete users[id];
      });
    });
  });
});

module.exports = {
  processUser: (req, res) => {
    const { body: { firebaseId, username } } = req;
    console.log(uI)
    const newTransaction = new userDetails({ uniqueId: uI, firebaseId, username});
    userDetails.find({firebaseId}, (err, dits) => {
      if (err) res.json({err});
      if (dits.length === 0) {
        newTransaction.save((err, dits) => {
          if (err) res.json({err});
          res.json(dits)
        });
      }
    })
  }
};
