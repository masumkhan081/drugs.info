const { response } = require("express");
const express = require("express");
const resetRoute = express.Router();
const jwt = require("jsonwebtoken");
const { tokenModel, userModel } = require("../models/userModel");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;
//

resetRoute.get("/:token", async (req, res) => {
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
              res.send("Already verified. you can login");
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
                            msg: "email verified: you can login now.",
                            authstatus : true,
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
          res.send("token expired !!");
        }
      }
    });
  } else {
    res.send("Invalid Link");
  }
});

module.exports = { resetRoute };
