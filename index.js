/*require("dotenv").config();
require("./Models/UserDetailsModel");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const api_port = process.env.API_PORT || 4001;
const routes = require("./routes");

//mongoose connection
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGOOSE_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  error => {
    if (error) throw error;
    console.log("DB connected");
  }
);

/** NEED for express *//*
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
routes(app);
app.listen(api_port, () => {
  console.log("Chat API up @ " + api_port);
});*/
require('dotenv').config();
const http = require('http');
const io = require('socket.io')();
const socketAuth = require('socketio-auth');
const firebase = require('firebase');
const admin = require("firebase-admin");

const serviceAccount = require("./adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kilembe-school.firebaseio.com"
});


// const database = require('@firebase/database');
var users = [];
const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID
});
const ref = app.database().ref('users');

const PORT = process.env.CHAT_PORT || 4000;
const server = http.createServer();

io.attach(server);

// dummy user verification
async function verifyUser (uid, email) {
  return new Promise((resolve, reject) => {
  
    ref.once('value').then( snapshot => {
      snapshot.forEach( user => {
        users.push(user.val());
      });
      // setTimeout to mock a cache or database call
      setTimeout(() => {
        // this information should come from your cache or database
        const user = users.find((user) => user.uid === uid && user.email === email);
        if (!user) {
          return reject('USER_NOT_FOUND');
        }
  
        return resolve(user);
      }, 200);
    })
  });
}

socketAuth(io, {
  authenticate: async (socket, data, callback) => {
    const { name, token } = data;

    try {
      const user = await verifyUser(token, name);

      socket.user = user;

      return callback(null, true);
    } catch (e) {
      console.log(`Socket ${socket.id} unauthorized.`);
      return callback({ message: 'UNAUTHORIZED' });
    }
  },
  postAuthenticate: (socket) => {
    console.log(`Socket ${socket.id} authenticated.`);
  },
  disconnect: (socket) => {
    console.log(`Socket ${socket.id} disconnected.`);
  },
})

server.listen(PORT);
