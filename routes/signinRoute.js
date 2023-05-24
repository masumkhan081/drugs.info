const express = require("express");
const signinRouter = express.Router();
const { checkExistence, sendMail } = require("../controllers/authFunctions");
const bcrypt = require("bcryptjs");
const { tokenModel } = require("../models/userModel");
const { tokenValid } = require("../routes/verifyRoute");
const jwt = require("jsonwebtoken");
//
signinRouter.get("/signin", (req, res) => {
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("page_login", {
      loggedin: false,
      data: "null",
      msg: "",
    });
  } else if (req.user.status == "logged-in") {
    res.render("page_landing", {
      loggedin: true,
      data: req.user,
      msg: "",
    });
  }
});

signinRouter.post("/signin", (req, res) => {
  const { email, password } = req.body;
  checkExistence(email).then((existance) => {
    if (existance.exist == false) {
      res.render("page_login", {
        msg: "Email not registered",
        email,
        password,
      });
      console.log(existance.exist + "    chk1");
    } else if (existance.verified == false) {
      tokenModel.findOne({ email }, (err, theToken) => {
        if (theToken) {
          if (tokenValid(theToken.expires) == true) {
            res.render("verificationMessage", {
              msg: "Account not verified yet.  A verification mail has already been sent to ",
              email,
              send_new_verification: true,
            });
            console.log("    chk4");
          } else {
            console.log("    chk3");
            tokenModel.findByIdAndDelete(theToken.id, (err, deletion) => {
              if (deletion) {
                console.log("expired token deleted. new token to be created");
              }
              res.render("verificationMessage", {
                msg: "A new verification mail has been sent to ",
                email,
                send_new_verification: true,
              });
            });
          }
        } else {
          sendMail({ email, id: existance.id }, req, res);
        }
      });
    } else if (existance.verified == true) {
      bcrypt.compare(password, existance.password, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("bcrpt result: " + JSON.stringify(result));
          let ttoken = "tokenpokath";
          res.cookie("auth-token", ttoken, { maxAge: 900000, httpOnly: true });
          res.redirect("/");
        }
      });
    }
  });
});
signinRouter.get("/logout", (req, res) => {
  console.log("before:    " + req.cookies["auth-token"]);
  res.clearCookie("auth-token");
  res.send("Cookie has been deleted successfully");
  console.log("after:  " + req.cookies["auth-token"]);
});

module.exports = signinRouter;
