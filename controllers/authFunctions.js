const { userModel, tokenModel } = require("../models/userModel");
const sendEmail = require("../controllers/emailSender");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;
//
async function checkExistence(email) {
  return await userModel
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        return { id: user.id, exist: true, verified: user.verified,password:user.password };
      } else {
        return { exist: false };
      }
    })
    .catch((err) => {
      return err;
    });
}

function sendMail(savedUser, req, res) {
  console.log("from sendmail:  " + JSON.stringify(savedUser));
  // same token for email verification and route verification
  var validationToken = jwt.sign({ id: savedUser.id }, secret);
  str = get_calculatedTime();
  let newToken = new tokenModel({
    userId: savedUser._id,
    token: validationToken,
    expires: str,
  });
  newToken
    .save()
    .then((savedToken) => {
      console.log("tkn:  " + savedToken.token);
      const message = `${process.env.BASE_URL}/verify/${savedToken.token}`;
      sendEmail(savedUser.email, "Verify Email", message)
        .then((emailResult) =>
          res.render("verificationMessage", {
            msg: "A verification mail has been sent to ",
            email: savedUser.email,
          })
        )
        .catch((err) => console.log("error sending verification email"));
    })
    .catch((err) => console.log("error saving new token in db" + err));
}

const tokenValid = (timeMark) => {
  console.log("tm:  " + timeMark);
  let d = new Date();
  d.setDate(timeMark[0]);
  d.setMonth(timeMark[1]);
  d.setYear(timeMark[2]);
  d.setHours(timeMark[3]);
  d.setMinutes(timeMark[4]);
  if (new Date().getTime() > d.getTime()) {
    console.log("verification link expired");
    return false;
  } else {
    console.log("seems token not expired yet");
    return true;
  }
};
function get_calculatedTime() {
  let d = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
  return (
    d.getDate() +
    "." +
    d.getMonth() +
    "." +
    d.getFullYear() +
    "." +
    d.getHours() +
    "." +
    d.getMinutes()
  );
}

module.exports = {
  checkExistence,
  sendMail,
  get_calculatedTime,
  tokenValid,
};
