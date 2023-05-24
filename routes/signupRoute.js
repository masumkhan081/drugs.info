const express = require("express");
const signupRouter = express.Router();
const { checkExistence, sendMail } = require("../controllers/authFunctions");
const bcrypt = require("bcryptjs");
const { userModel } = require("../models/userModel");
//
//
signupRouter.get("/register", (req, res) => {
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("page_register", {
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

//
signupRouter.post("/register", (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  console.log(name, email, password, confirmpassword);
  let errors = [];
  if (name.length < 2) {
    errors.push("Name Too Short");
  }
  if (password != confirmpassword) {
    errors.push("Dissimilar passwords");
  }
  checkExistence(email).then((existance) => {
    if (existance.exist == true) {
      errors.push("Email already registered");
    }
    if (errors.length > 0) {
      res.render("page_register", {
        errors,
        name,
        email,
        password,
        password2: confirmpassword,
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (hash) {
            const newUser = new userModel({
              name,
              email,
              password: hash,
            });
            newUser
              .save()
              .then((savedUser) => {
                //
                sendMail(savedUser, req, res);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      });
    }
  });
});

module.exports = signupRouter;
