const express = require("express");
const router = express.Router();
const cmpFunctions = require("../controllers/cmpController"); // controller functions

router.get("/", (req, res) => {
    cmpFunctions.renderCompanies(req, res);
});

router.post("/", (req, res) => {
    cmpFunctions.createAndSave(req, res);
});

router.post("/edt", (req, res) => {
    console.log("method: post route:edt");
    cmpFunctions.handleUpdate(req, res);
});
router.get("/dlt", (req, res) => {
    cmpFunctions.handleDelete(req, res);
});

router.delete("/dlt", (req, res) => {
    console.log("method: delete route:dlt");
    cmpFunctions.handleDelete(req, res);
});

//
module.exports = router;