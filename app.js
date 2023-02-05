//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const https = require("https");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const authRoute = require("./routes/auth");

app.use(express.json()); // for parsing application/json instead of body-parser

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

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

mongoose.connect("mongodb://localhost:27017/userDb");

//routes
app.use('/', authRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});


app.listen(3000, () => {
  console.log("Server is running on http//localhost:3000 ");
});
