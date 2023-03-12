const router = require("express").Router();
const obj = require("../controllers/renderMaster");
//------------------------------------------------     model & controller
const genFunctions = require("../controllers/genController");
const drgFunctions = require("../controllers/drgController");
const { drugDetailModel, drugModel } = require("../models/models");
//
router.get("/", (req, res) => {
  drgFunctions.setDrugs(req, res);
});

router.post("/", (req, res) => {
  const { drgname, selectedcmp, selectedgen } = req.body;
  console.log(":: -- " + drgname);
  drgFunctions
    .checkExistence(drgname)
    .then((exist) => {
      if (exist == true) {
        req.flash("msg", obj.msg_exist);
        res.redirect("/drugs");
      } else {
        drgFunctions
          .createAndSave(drgname, selectedgen, selectedcmp)
          .then((data) => {
            req.flash("msg", obj.msg_save);
            res.redirect("/drugs");
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      console.log("err: " + err);
    });
});
router.post("/detectgrp", (req, res) => {
  const { genid } = req.body;
  console.log(genid + " detectgrp req recieved");

  genFunctions
    .getById(genid)
    .then((data) => {
      res.send({ data: data });
    })
    .catch((err) => {
      console.log("err-: " + err);
    });
});

router.post("/gensbygrp", (req, res) => {
  const grp_id = req.body.grpid;

  genFunctions
    .getGenerics(0, 0, grp_id)
    .then((data) => {
      res.send({ gens: data, count: data.length });
    })
    .catch((err) => {
      console.log("err-: " + err);
    });
});
router.post("/edt", (req, res) => {
  const { drgid, drgname, cmpid, genid } = req.body;
  //console.log(JSON.stringify(req.body));

  drugModel
    .findByIdAndUpdate(
      drgid,
      { name: drgname, gen_id: genid, cmp_id: cmpid },
      function (err, docs) {
        if (err) {
          obj.msg = obj.msg_err_update;
        } else {
          obj.msg = obj.msg_update;
        }
        res.redirect("/drugs");
      }
    )
    .catch((err) => console.log(err));
});
router.get("/dlt", (req, res) => {
  const { drgid } = req.query;
  drugModel.findByIdAndDelete(drgid, function (err, docs) {
    if (err) {
      obj.msg = obj.msg_err_delete;
    } else {
      obj.msg = obj.msg_delete;
    }
    res.redirect("/drugs");
  });
});
router.post("/detail", (req, res) => {
  const { strength, frm_id, drg_id } = req.body;
  const newDrugDetail = new drugDetailModel({
    drg_id,
    frm_id,
    strength,
  });
  newDrugDetail
    .save()
    .then((saved) => {
      obj.msg = obj.msg_save;
      res.redirect("/drugs");
    })
    .catch((err) => {
      console.log("error in saving new drug detail");
    });
});
router.post("/detail/edt", (req, res) => {
  const { detailid, strength, frmid } = req.body;
  console.log(":---- " + detailid, strength, frmid);
  drugDetailModel.findByIdAndUpdate(
    detailid,
    { strength, frm_id: frmid },
    function (err, docs) {
      if (docs) {
      } else {
      }
      res.redirect("/drugs");
    }
  );
});
router.get("/detail/dlt", (req, res) => {
  const { detailid, drugid } = req.query;
  console.log(detailid + "  ?  " + drugid);
  drugDetailModel.findByIdAndDelete(detailid, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      obj.msgdetail = obj.msg_delete;
      res.redirect("/drugs/details/" + drugid);
    }
  });
});

module.exports = router;
