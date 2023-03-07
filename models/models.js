const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const drugSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gen_id: {
    type: String,
    required: true,
  },
  cmp_id: {
    type: String,
    required: true,
  },
});
//
const drugDetailSchema = new Schema({
  drg_id: {
    type: String,
    required: true,
  },
  frm_id: {
    type: String,
    required: true,
  },
  strength: {
    type: String,
    required: true,
  },
});
const genericSchema = new Schema({
  grp_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const formulationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});
//
const formulationModel = mongoose.model("formulations", formulationSchema);
const genericModel = mongoose.model("generics", genericSchema);
const drugModel = mongoose.model("drugs", drugSchema);
const drugDetailModel = mongoose.model("drug-detail", drugDetailSchema);
const groupModel = mongoose.model("groups", groupSchema);
const companyModel = mongoose.model("companies", companySchema);
//
module.exports = {
  groupModel,
  drugDetailModel,
  genericModel,
  drugModel,
  formulationModel,
  companyModel,
};
