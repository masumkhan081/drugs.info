const obj = require("./renderMaster");
const { companyModel } = require("../models/models");
//

function renderCompanies(req, res) {
  let msg = req.flash("msg");

  const { pagenumb } = req.query;
  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }
  companyModel
    .find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((companies) => {
      companyModel.count({}, function (err, count) {
        msg = count == 0 ? "No Data In System" : msg;
        res.render("page_company", {
          companies,
          msg,
          count,
          skip,
          authstatus:false,
          limit: obj.limit,
        });
      });
    })
    .catch((err) => {
      res.send(obj.msg_err_load);
    });
}

function createAndSave(req, res) {
  const { cmpname, pagenumb } = req.body;
  let redirectUrl =
    pagenumb === "1" ? "/companies" : "/companies?pagenumb=" + pagenumb;
  console.log(pagenumb + "    see me:  " + cmpname);
  checkExistence(cmpname)
    .then((exist) => {
      if (exist == true) {
        req.flash("msg", obj.msg_exist);
        res.redirect(redirectUrl);
      } else {
        const newCompany = new companyModel({
          name: cmpname,
        });
        newCompany
          .save()
          .then((saved) => {
            req.flash("msg", obj.msg_save);
            renderCompanies(req, res);
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
  const { cmpid, cmpname, pagenumb } = req.body;
  let redirectUrl =
    pagenumb === "1" ? "/companies" : "/companies?pagenumb=" + pagenumb;

  checkExistence(cmpname)
    .then((exist) => {
      if (exist == true) {
        req.flash("msg", obj.msg_no_edit);
        res.redirect(redirectUrl);
      } else {
        companyModel.findByIdAndUpdate(
          cmpid,
          { name: cmpname },
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
  const { cmpid, pagenumb } = req.query;
  let redirectUrl =
    pagenumb === "1" ? "/companies" : "/companies?pagenumb=" + pagenumb;
  companyModel.findByIdAndDelete(cmpid, function (err, docs) {
    if (docs) {
      req.flash("msg", obj.msg_delete);
    } else {
      req.flash("msg", obj.msg_err_delete);
    }
    res.redirect(redirectUrl);
  });
}
async function getById(cmpid) {
  return await companyModel
    .findById(cmpid)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}
async function checkExistence(name) {
  return await companyModel
    .findOne({ name })
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

async function getCompanies(skip, limit) {
  return await companyModel
    .find()
    .limit(limit)
    .skip(skip)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}

const cmpFunctions = {
  getById,
  checkExistence,
  handleUpdate,
  handleDelete,
  createAndSave,
  renderCompanies,
  getCompanies,
};
module.exports = cmpFunctions;
