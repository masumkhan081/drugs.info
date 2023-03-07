const router = require("express").Router();
//------------------------------------------------     model & controller
const grpFunctions = require("../controllers/grpController");
//
router.get("/", (req, res) => {
    grpFunctions.renderGroups(req, res);
});

router.post("/", (req, res) => grpFunctions.createAndSave(req, res));

router.post("/edt", (req, res) => grpFunctions.handleUpdate(req, res));

router.get("/dlt", (req, res) => grpFunctions.handleDelete(req, res));

router.get("/edt/:grpid", (req, res) => {
    res.send(req.params["grpid"]);
});

module.exports = router;