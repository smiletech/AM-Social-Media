const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const feedpost = require("./router/image.router");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const edit = require("./router/Edit");
const login = require("./router/login");
const register = require("./router/register");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;
// db connection
const db = mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`db connected `);
  }
);

//   midlleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//   midlleware

app.use(express.json());
app.use(cors());

app.use("/sign-up", register);
app.use("/login", login);
app.use("/", edit);
app.use("/", feedpost);
app.use(express.static(path.join(__dirname, "image")));

app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
