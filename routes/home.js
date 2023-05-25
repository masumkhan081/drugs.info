const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // console.log("::  " + req.cookies["auth-token"]);
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("page_landing", {
      authstatus : false,
      data: "null",
    });
  } else if (req.user.status == "logged-in") {
    res.render("page_landing", {
      authstatus : true,
      data: req.user,
    });
  }
});

module.exports = router;
