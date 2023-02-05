const router = require("express").Router();
const passport = require("passport")

const User = require("../models/User");

// npm Passport docs"
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

//Register User in database
router.post("/register", async (req, res) => {
  try {
    const registerUser = await User.register(
      { username: req.body.username },
      req.body.password);
    if (registerUser) {
      authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    } else {
      res.redirect("/register");
    }
  } catch (error) {}
});

router.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      authenticate("local", { failureRedirect: "/login" }),
        (req,res,() => {
          res.redirect("/secrets");
        });
    }
  });
});

router.post('/logout', function (req, res) {
    req.logout();
    req.redirect('/login');
});

module.exports = router;
