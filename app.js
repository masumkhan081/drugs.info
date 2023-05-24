const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
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

mongoose.connect(process.env.URI, { useNewUrlParser: true });
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
app.listen(process.env.PORT, () => {
  console.log(`port:${process.env.PORT}`);
});
// ------------------------------------------          view engine and layout
app.set("view engine", "ejs");
app.use(ejsLayout);

// ------------------------------------------          middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(flash());
//   ------------------------------------------            routes
app.use("", require("./routes/home"));
app.use("", require("./routes/signupRoute"));
app.use("", require("./routes/signinRoute"));
app.use("/verify", verifyRoute);
app.use("/reset", resetRoute);
app.use("/drugs", require("./routes/drgRoutes"));
app.use("/groups", require("./routes/grpRoutes"));
app.use("/generics", require("./routes/genRoutes"));
app.use("/formulations", require("./routes/frmRoutes"));
app.use("/companies", require("./routes/cmpRoutes"));
app.use("/api", require("./routes/json"));
app.use("", require("./routes/google"));
//app.use("", require("./routes/linkedin"));
//app.use("", require("./routes/facebook"));
//app.use("", require("./routes/github"));
//
app.use(passport.initialize());
app.use(passport.session());

/*
git init
git add *
git commit -m "msg"
git push
*/
