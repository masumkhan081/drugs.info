const { json } = require("express");
const express = require("express");
const router = express.Router();
const pathStaticFile = require("path").join(__dirname, "..", "/views");
//------------------------------------------------     model & controller
const jsonFunctions = require("../controllers/jsonController");
const cmpFunctions = require("../controllers/cmpController");
//
let jsonData = [];

router.get("/groups", (req, res) => {
  const { skip, limit } = req.query;
  console.log("query:   " + skip + "   and: " + limit);

  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
router.get("/groups/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
//

router.get("/formulations", (req, res) => {
  const { skip, limit } = req.query;
  console.log("query:   " + skip + "   and: " + limit);

  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
router.get("/formulations/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});

//

router.get("/manufacturers", (req, res) => {
  cmpFunctions.renderCompanies(req, res, "ren");
});
router.get("/manufacturers/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});

//

router.get("/generics", (req, res) => {
  const { skip, limit } = req.query;
  console.log("query:   " + skip + "   and: " + limit);

  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
router.get("/generics/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
router.get("/generics/search?q=Laptop", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
//

router.get("/drugs", (req, res) => {
  const { skip, limit } = req.query;
  console.log("query:   " + skip + "   and: " + limit);

  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
router.get("/drugs/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
router.get("/drugs/search?q=Laptop", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});
router.get("/drugs/:id", (req, res) => {
  const { skip, limit } = req.params;
  console.log("params: " + skip + " and: " + limit);
  const obj = { result: "resul...............t !", id: "1" };
  res.render("jsonPage", { result: JSON.stringify(obj) });
});

//

module.exports = router;
