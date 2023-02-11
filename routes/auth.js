const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login")
})

router.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/");
  }
});

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) {console.log(err); }
    res.redirect('/');
  });
});

router.post("/register", (req, res) => {
  //passport-local-mongoose
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        // passport-local npm
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    });
});



router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/secrets');
  });

module.exports = router;
