const express = require("express");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleRoutes = express.Router();
const { tokenModel, userModel } = require("../models/userModel");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
//
googleRoutes.use(cookieParser());
//
passport.use(
  new GoogleStrategy(
    {
      /*
       */
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_DOMAIN + "/auth/google/callback",
      profileFields: ["id", "emails", "name", "photos"], //This
    },
    function (accessToken, refreshToken, profile, cb) {
      //
      const name = profile["displayName"];
      const email = profile["emails"][0].value;
      const photo = profile["photos"][0].value;
      const provider = profile["provider"];
      //
      return cb(null, { status: "logged-in", name, email, photo, provider });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
googleRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

googleRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = googleRoutes;
