//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const https = require("https");
const ejs = require("ejs");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");
const authRoute = require("./routes/auth");

app.use(express.json()); // for parsing application/json instead of body-parser

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing

app.set("view engine", "ejs");



// To mute the error message
mongoose.set("strictQuery", true);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/userDb");

//routes
app.use('/', authRoute);

// passport configurations
const User = require('./models/User')
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.listen(3000, () => {
  console.log("Server is running on http//localhost:3000 ");
});
