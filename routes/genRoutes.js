const router = require("express").Router();
const genFunctions = require("../controllers/genController");
//
router.get("/", (req, res) => {
    console.log("get: render-generic ");
    genFunctions.renderGeneric(req, res);
});
router.post("/", (req, res) => {
    genFunctions.createAndSave(req, res);
});
router.get("/groups", (req, res) => {
    genFunctions.setGroups(req, res);
});
router.get("/genbygrp", (req, res) => {
    genFunctions.renderGeneric(req, res);
});
router.post("/genbygrp", (req, res) => {
    // console.log("2: " + JSON.stringify(req.body) + "  " + JSON.stringify(req.query) + "  " + JSON.stringify(req.params))
    res.send("dfggj");
});

router.post("/update", (req, res) => {
    genFunctions.handleUpdate(req, res);
});
router.post("/delete", (req, res) => {
    genFunctions.handleDelete(req, res);
});

module.exports = router;