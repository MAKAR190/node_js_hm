const express = require("express");
const cors = require("cors");
const volleyball = require("volleyball");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { Auth } = require("./routes");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const { User } = require("./models");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    key: "session-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 2592000000,
      path: "/",
    },
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(helmet());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({
          username,
        });
        if (!user || !(await user.validPassword(password))) {
          done(null, false);
          return;
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
app.use(volleyball);
app.use(
  cors({
    origin: "*",
  })
);
app.set("views", "./views");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/profile", (req, res) => {
  res.render("profile", {
    username: req.user.username,
  });
});
app.get("/login", (req, res) => {
  res.render("login", {
    message: req.flash("message"),
  });
});
app.get("/register", (req, res) => {
  res.render("register", {
    message: req.flash("message"),
  });
});
app.use("/auth", Auth);
module.exports = app;
