const express = require("express");
const verifyRoute = express.Router();
const jwt = require("jsonwebtoken");
const { tokenModel, userModel } = require("../models/userModel");
const {
  checkExistence,
  sendMail,
  tokenValid,
} = require("../controllers/authFunctions");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;
//
verifyRoute.post("/", async (req, res) => {});

//
verifyRoute.get("/:token", async (req, res) => {
  const { token } = req.params;
  const verified = jwt.verify(token, secret);
  if (verified) {
    const userid = verified.id;
    console.log(userid + "    :: extracted ::  " + token);

    tokenModel.findOne({ token }, (err, tokenData) => {
      if (err) {
      } else {
        console.log("tokenData   " + tokenData.expires);
        if (tokenValid(tokenData.expires.split(".")) == true) {
          userModel.findById(userid, function (err, theUser) {
            if (err) {
              console.log(err);
            } else if (theUser.verified == true) {
              res.render("page_login", {
                msg: "Already verified. you can login",
              });
            } else {
              userModel.findByIdAndUpdate(
                theUser._id,
                { verified: true },
                function (err, docs) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Updated User : ", docs);
                    tokenModel.findByIdAndRemove(
                      theUser._id,
                      function (err, docs) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("Removed token : ", docs);
                          res.render("page_login", {
                            msg: "Email verified: you can login now.",
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        } else {
          res.render("verificationMessage", {
            msg: "Token Expired !",
          });
        }
      }
    });
  } else {
    res.render("verificationMessage", {
      msg: "Invalid Link !",
    });
  }
});

module.exports = { verifyRoute };
