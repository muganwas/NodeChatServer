require("dotenv").config();
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

/** NEED for express */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
routes(app);
app.listen(api_port, () => {
  console.log("Chat API up @ " + api_port);
});
