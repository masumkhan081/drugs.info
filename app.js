const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
// const serverless = require("serverless-http");
const flash = require("connect-flash");
require("dotenv").config();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ejsLayout = require("express-ejs-layouts");
const { verifyRoute } = require("./routes/verifyRoute");
const { resetRoute } = require("./routes/resetRoute");
const { setGroups } = require("./controllers/genController");
// -------------------------------------------            -connection
const process_env_URI =
  "mongodb+srv://mkhan:passme@cluster-drug-stock.hcrtyb4.mongodb.net/?retryWrites=true&w=majority";
const process_env_PORT = 5000;
mongoose.connect(process_env_URI, { useNewUrlParser: true });
const conn = mongoose.connection;
conn.on("connected", function () {
  console.log("database is connected successfully");
  const db = conn.db;
  setGroups();
});
conn.on("disconnected", function () {
  console.log("database is disconnected");
});
conn.on("error", () => {
  console.log("Way to go ! web application with no internet ?");
});

// --------------------------------------------        server-start
const app = express();
app.listen(process_env_PORT, () => {
  console.log(`port:${process_env_PORT}`);
});
// ------------------------------------------          view engine and layout
app.set("view engine", "ejs");
app.use(ejsLayout);

// ------------------------------------------          middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: "pokath",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
//   ------------------------------------------            routes
app.use("/users", require("./routes/signupRoute"));
app.use("/users", require("./routes/signinRoute"));
app.use("/verify", verifyRoute);
app.use("/reset", resetRoute);
app.use("/drugs", require("./routes/drgRoutes"));
app.use("/groups", require("./routes/grpRoutes"));
app.use("/generics", require("./routes/genRoutes"));
app.use("/formulations", require("./routes/frmRoutes"));
app.use("/companies", require("./routes/cmpRoutes"));
app.use("/api", require("./routes/indexRoute"));
//

//
app.get(
  "/",
  (req, res, next) => {
    console.log("miflwr reached ...");
    if (req.cookies["auth-token"]) {
      console.log("mdlwr-reached-token");
      res.render("page_drug", { authstatus: "true" });
    } else {
      console.log("mdlwr-reached-no_token");
      res.render("page_login", { authstatus: "false" });
    }
    next();
  },
  (req, res) => {
    console.log("::  " + req.cookies["auth-token"]);
    if (req.cookies["auth-token"]) {
      res.render("page_landing", { authstatus: "true" });
    } else {
      res.render("page_landing", { authstatus: "false" });
    }
  }
);

// module.exports.handler = serverless(app);
/*


"dev": "nodemon app.js",
    "install": "npm install",
    "build": "npm build"


git init
git add *
git commit -m "msg"
git push

*/
