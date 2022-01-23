const express = require("express");
const passport = require("passport");
const { User } = require("../models");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();
function loginUser(req, res, next) {
  passport.authenticate("local", (err, user) => {
    if (!user) {
      req.flash("message", "Wrong Credentials...");
      res.redirect("/login");
      return;
    }
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }
      // res.status(200).json(user);
      res.redirect("/profile");
    });
  })(req, res, next);
}
router.post("/login", loginUser);
router.post("/register", async (req, res, next) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("message", "Username is already taken...");
      res.redirect("/register");
      return;
    }
    const newUser = new User(req.body);

    await newUser.hashPassword();

    await newUser.save();

    loginUser(req, res, next);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/profile", isAuth, (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post("/logout", isAuth, (req, res) => {
  try {
    req.logout();
    res.redirect("/");
    // res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
