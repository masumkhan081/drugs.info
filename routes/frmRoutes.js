const router = require("express").Router();
const frmFunctions = require("../controllers/frmController");
//
router.get("/", (req, res) => {
  frmFunctions.renderFormulations(req, res);
});

router.post("/", (req, res) => {
  frmFunctions.createAndSave(req, res);
});
router.post("/edt", (req, res) => {
  console.log("post /edt " + JSON.stringify(req.body));
  frmFunctions.handleUpdate(req, res);
});
router.get("/edt", (req, res) => {
  console.log("get /edt");
  res.send("get /edt");
  //  frmFunctions.handleUpdate(req, res);
});

router.get("/dlt", (req, res) => {
  frmFunctions.handleDelete(req, res);
});

// router.delete("/dlt", (req, res) => {
//   console.log("here-222");
//   frmFunctions.handleDelete(req, res);
// });

module.exports = router;
