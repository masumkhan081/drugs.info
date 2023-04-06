const { genericModel, groupModel } = require("../models/models");
const grpFunctions = require("./grpController");
const obj = require("./renderMaster");
//
function createAndSave(req, res) {
  let { current_selectedgrp, pagenumb, genname, selectedgrp } = req.body;
  console.log(pagenumb + "    omniscient");
  let successUrl = "/generics?selectedgrp=" + selectedgrp;
  let failureUrl = "/generics?selectedgrp=" + current_selectedgrp;
  failureUrl += pagenumb === "1" ? "" : "&pagenumb=" + pagenumb;

  checkExistence(genname)
    .then((exist) => {
      if (exist == true) {
        req.flash("msg", obj.msg_exist);
        res.redirect(failureUrl);
      } else {
        const newGeneric = new genericModel({
          grp_id: selectedgrp,
          name: genname,
        });
        newGeneric
          .save()
          .then((data) => {
            req.flash("msg", obj.msg_save);
            res.redirect(successUrl);
          })
          .catch((err) => {
            req.flash("msg", obj.msg_err_save);
            res.redirect(failureUrl);
          });
      }
    })
    .catch((err) => {
      console.log("err: " + err);
    });
}

const handleUpdate = (req, res) => {
  const { selectedgrpid, genname, genid, pagenumb, current_selectedgrp } =
    req.body;
  let redirectUrl =
    "/generics?selectedgrp=" + current_selectedgrp + pagenumb === "1"
      ? ""
      : "&pagenumb=" + pagenumb;

  // check existance can be usefull given that name and grpid both would be cheked
  // if none changed then send -> obj.msg_no_edit
  genericModel
    .findByIdAndUpdate(
      genid,
      { name: genname, grp_id: selectedgrpid },
      function (err, docs) {
        if (docs) {
          req.flash("msg", obj.msg_update);
          res.redirect(redirectUrl);
        } else {
          req.flash("msg", obj.msg_err_update);
          res.redirect(redirectUrl);
        }
      }
    )
    .catch((err) => console.log(err));
};

const handleDelete = (req, res) => {
  const { genid, current_selectedgrp, pagenumb } = req.body;
  let redirectUrl =
    "/generics?selectedgrp=" + current_selectedgrp + pagenumb === "1"
      ? ""
      : "&pagenumb=" + pagenumb;
  genericModel.findByIdAndDelete(genid, function (err, docs) {
    if (docs) {
      req.flash("msg", obj.msg_update);
    }
    if (err) {
      req.flash("msg", obj.msg_err_delete);
    }
    res.redirect(redirectUrl);
  });
};

function renderGeneric(req, res) {
  let { pagenumb, selectedgrp } = req.query;
  selectedgrp = typeof selectedgrp === "undefined" ? "none" : selectedgrp;
  //selectedgrp = selectedgrp === "none" ? "none" : selectedgrp;
  console.log("check:2= " + selectedgrp);
  let msg = req.flash("msg");
  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }
  let searchQuery = selectedgrp === "none" ? {} : { grp_id: selectedgrp };

  genericModel
    .find(searchQuery)
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((generics) => {
      genericModel.count(searchQuery, function (err, count) {
        msg = count == 0 ? obj.msg_no_data : msg;
        res.render("page_generic", {
          generics,
          groups: obj.grps,
          selectedgrp,
          msg,
          count,
          authstatus: false,
          skip,
          limit: obj.limit,
        });
      });
    })
    .catch((err) => {
      return err;
    });
}
const setGroups = (req, res) => {
  grpFunctions
    .getGroups(0, 0)
    .then((data) => {
      obj.grps = data;
      //  console.log(data)
      //  res.redirect("/generics");
    })
    .catch((err) => {
      res.send(obj.msg_err_load);
    });
};
const setGenerics = (req, res, grpid) => {
  getGenerics(obj.skip, obj.limit, grpid)
    .then((data) => {
      obj.gens = data;
      obj.selectedgrp = grpid;
      obj.msg = data.length > 0 ? obj.msg : "No generic found";
      res.redirect("/generics");
    })
    .catch((err) => {
      console.log(err);
    });
};
async function getById(genid) {
  return await genericModel
    .findById(genid)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}

async function checkExistence(name) {
  return await genericModel
    .findOne({ name: name })
    .then((res) => {
      if (res) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return err;
    });
}
async function getGenerics(skip, limit, grp_id) {
  return await genericModel
    .find({ grp_id })
    .limit(limit)
    .skip(skip)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}
const genFunctions = {
  getById,
  renderGeneric,
  checkExistence,
  createAndSave,
  setGroups,
  setGenerics,
  getGenerics,
  handleUpdate,
  handleDelete,
};
module.exports = genFunctions;
