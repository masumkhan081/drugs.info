const obj = require("./renderMaster");
const {
  drugModel,
  drugDetailModel,
  formulationModel,
} = require("../models/models");
const cmpFunctions = require("./cmpController");
const grpFunctions = require("./grpController");
const genFunctions = require("./genController");
const frmFunctions = require("./frmController");
//

function setDrugs(req, res) {
  const { pagenumb } = req.query;
  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }
  drugModel
    .find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((data) => {
      if (data.length == 0) {
        render_nothing(res);
      } else {
        fillup_drg_infos(req, res, skip, [], data, 0);
      }
    })
    .catch((err) => {
      return err;
    });
}
function render_nothing(res) {
  res.render("page_drug", {
    drugs: [],
    groups: [],
    companies: [],
    formulations: [],
    msg: obj.msg_no_data,
    count: 0,
    authstatus: false,
    skip: obj.skip,
    limit: obj.limit,
    authstatus: false,
    msgdetail: "",
    details: [],
    detailOf: "",
  });
}

function fillup_drg_infos(req, res, skip, arr_drugs, data, i) {
  let drg_id, drg_name, gen_id, gen_name, cmp_id, cmp_name;

  if (i == data.length) {
    fill_frms_grps_cmps(req, res, skip, arr_drugs);
  } else {
    drg_name = data[i].name;
    drg_id = data[i].id;
    gen_id = data[i].gen_id;
    cmp_id = data[i].cmp_id;
    Promise.all([
      genFunctions
        .getById(gen_id)
        .then((gen) => {
          gen_name = gen.name;
        })
        .catch((err) => console.log(err)),
      cmpFunctions
        .getById(cmp_id)
        .then((cmp) => {
          cmp_name = cmp.name;
        })
        .catch((err) => console.log(err)),
    ])
      .then((_) => {
        arr_drugs.push({
          drg_id,
          drg_name,
          cmp_id,
          cmp_name,
          gen_id,
          gen_name,
        });
        fillup_drg_infos(req, res, skip, arr_drugs, data, i + 1);
      })
      .catch((err) => {
        console.log("--------  " + err);
      });
  }
}

function fill_frms_grps_cmps(req, res, skip, drugs) {
  const { drgid } = req.query;
  let msg = req.flash("msg");
  let companies,
    formulations,
    groups,
    count,
    msgdetail = "",
    details = [],
    detailOf = {},
    limit = obj.limit;
  Promise.all([
    cmpFunctions.getCompanies(0, 0).then((data) => (companies = data)),
    grpFunctions.getGroups(0, 0).then((data) => (groups = data)),
    frmFunctions.getFormulations(0, 0).then((data) => (formulations = data)),
  ])
    .then((finished) => {
      drugModel.count({}, function (err, numberOfDrugs) {
        if (numberOfDrugs) {
          count = numberOfDrugs;
          if (drgid === undefined) {
            res.render("page_drug", {
              drugs,
              groups,
              companies,
              formulations,
              msg,
              count,
              skip,
              limit,
              authstatus: false,
              msgdetail,
              details,
              detailOf,
            });
          } else {
            drugDetailModel.find({ drg_id: drgid }, function (err, docs) {
              if (docs) {
                let len = docs.length;
                fill(0);

                function fill(i) {
                  if (i == len) {
                    drugModel
                      .findById(drgid)
                      .then((drg) => {
                        detailOf.name = drg.name;
                        detailOf.id = drg.id;
                        msgdetail = " !!";
                        res.render("page_drug", {
                          drugs,
                          groups,
                          companies,
                          formulations,
                          msg,
                          count,
                          skip,
                          limit,
                          authstatus: false,
                          msgdetail,
                          details,
                          detailOf,
                        });
                      })
                      .catch((err) => {});
                  } else {
                    let objDetail = {};
                    objDetail.id = docs[i].id;
                    objDetail.strength = docs[i].strength;
                    objDetail.frmid = docs[i].frm_id;

                    formulationModel.findById(
                      docs[i].frm_id,
                      function (err, frm) {
                        if (err) {
                          console.log(err);
                        } else {
                          objDetail.frmname = frm.name;
                          details.push(objDetail);
                          fill(i + 1);
                        }
                      }
                    );
                  }
                }
              }
              if (err) {
                console.log("err: " + err);
              }
            });
          }
        }
        if (err) {
          console.log("err counting number of drugs");
        }
      });
    })
    .catch((err) => console.log("err: " + err));
}

async function getDrugs(limit, skip) {
  return await drugModel
    .find()
    .sort({ $natural: -1 })
    .limit(limit)
    .skip(skip)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}

async function getDetails(drg_id) {
  return await drugDetailModel
    .find({ drg_id })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}

async function createAndSave(name, gen_id, cmp_id) {
  const newDrug = new drugModel({
    name,
    gen_id,
    cmp_id,
  });
  return await newDrug
    .save()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}

async function checkExistence(name) {
  return await drugModel
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

const drugFunctions = {
  getDetails,
  checkExistence,
  createAndSave,
  getDrugs,
  setDrugs,
};
module.exports = drugFunctions;
