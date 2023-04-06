const { groupModel } = require("../models/models");
const { setGroups } = require("./genController");
const obj = require("./renderMaster");
//

function renderGroups(req, res) {
  const { pagenumb } = req.query;
  let msg = req.flash("msg");
  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }
  groupModel
    .find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((data) => {
      groupModel.count({}, function (err, count) {
        msg = count == 0 ? obj.msg_no_data : msg;

        res.render("page_group", {
          groups: data,
          msg,
          count,
          skip,
          authstatus: false,
          limit: obj.limit,
        });
      });
    })
    .catch((err) => {
      res.send(obj.msg_err_load);
    });
}

function createAndSave(req, res) {
  const { grpname, pagenumb } = req.body;
  let redirectUrl =
    pagenumb === "1" ? "/groups" : "/groups?pagenumb=" + pagenumb;

  checkExistence(grpname)
    .then((exist) => {
      if (exist == true) {
        req.flash("msg", obj.msg_exist);
        res.redirect(redirectUrl);
      } else {
        const newGroup = new groupModel({
          name: grpname,
        });
        newGroup
          .save()
          .then((data) => {
            req.flash("msg", obj.msg_save);
            renderGroups(req, res);
          })
          .catch((err) => {
            req.flash("msg", obj.msg_err_save);
            res.redirect(redirectUrl);
          });
      }
    })
    .catch((err) => {
      console.log("err: " + err);
    });
}

function handleUpdate(req, res) {
  const { grpid, grpname, pagenumb } = req.body;

  let redirectUrl =
    pagenumb === "1" ? "/groups" : "/groups?pagenumb=" + pagenumb;

  checkExistence(grpname)
    .then((exist) => {
      if (exist == true) {
        req.flash("msg", obj.msg_no_edit);
        res.redirect(redirectUrl);
      } else {
        groupModel.findByIdAndUpdate(
          grpid,
          { name: grpname },
          function (err, docs) {
            if (docs) {
              req.flash("msg", obj.msg_update);
            } else {
              req.flash("msg", obj.msg_err_update);
            }
            res.redirect(redirectUrl);
          }
        );
      }
    })
    .catch((err) => console.log(err));
}

function handleDelete(req, res) {
  const { grpid, pagenumb } = req.query;
  let redirectUrl =
    pagenumb === "1" ? "/groups" : "/groups?pagenumb=" + pagenumb;

  groupModel.findByIdAndDelete(grpid, function (err, docs) {
    if (docs) {
      req.flash("msg", obj.msg_delete);
    } else {
      req.flash("msg", obj.msg_err_delete);
    }
    res.redirect(redirectUrl);
  });
}
async function checkExistence(name) {
  return await groupModel
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
async function getGroups(skip, limit) {
  return await groupModel
    .find()
    .sort({ $natural: -1 })
    .limit(limit)
    .skip(skip)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}
const grpFunctions = {
  checkExistence,
  createAndSave,
  handleDelete,
  handleUpdate,
  getGroups,
  renderGroups,
};
module.exports = grpFunctions;
