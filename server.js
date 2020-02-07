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
const path = require('path')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketAuth = require('socketio-auth');
const admin = require("firebase-admin");
const cors = require('cors');

const serviceAccount = require("./adminsdk.js").vars;
const jsonServiceAcount = JSON.parse(JSON.stringify(serviceAccount));
admin.initializeApp({
  credential: admin.credential.cert(jsonServiceAcount),
  databaseURL: "https://kilembe-school.firebaseio.com"
});

const PORT = process.env.CHAT_PORT;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
const routes = require('./routes');
routes(app);
const server = require('http').createServer(app);
const io = require('socket.io').listen(server)

// firebase authontication
const verifyUser = async token => {
  return new Promise((resolve, reject) => {
    admin.auth().verifyIdToken(token)
	  .then(response => {
        // console.log(response.data)
        let rez= {
            "access_token": token,
            "expires_in": response.exp
        }
        resolve(rez);
    })
    .catch(err => {
        console.log(err);
        reject({ error: err })
    })
  });
}

socketAuth(io, {
  authenticate: async (socket, data, callback) => {
    const { token } = data;
    try {
      const user = await verifyUser(token);
      socket.user = user;
      return callback(null, true);
    } catch (e) {
      console.log(`Socket ${socket.id} unauthorized.`);
      return callback({ message: 'UNAUTHORIZED' });
    }
  },
  postAuthenticate: socket => {
    console.log(`Socket ${socket.id} authenticated.`);
  },
  disconnect: socket => {
    console.log(`Socket ${socket.id} disconnected.`);
  },
});

io.sockets.on('connection', socket => {
  console.log('bs')
})
server.listen(PORT);
