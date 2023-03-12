const obj = {
  limit: 10,
  skip: 0,
  frmCount: 0,
  grpCount: 0,
  genCount: 0,
  drugCount: 0,
  cmpCount: 0,
  // drgs: [],
  //  cmps: [],
  grps: [],
  //   frms: [],
  //   gens: [],

  // msg: "",
  // msgdetail: "",
  // act: "",
  //  what: "",
  msg_nothing: " ",
  msg_associated: "Not deleted. association found",
  msg_delete: "Deleted  successfuly",
  msg_save: "Saved  successfuly",
  msg_no_data: "No Data In System",
  msg_update: "Updated successfuly",
  msg_no_edit: "Huh ! updating to something alraedy exist ?",
  msg_exist: "That shit already exist",
  msg_err_load: "Error getting data from db",
  msg_err_update: "Error updating",
  msg_err_delete: "Error deleting from db",
  msg_err_save: "Error saving data",
  changeSkip: () => {
    obj.skip = obj.skip + obj.limit;
  },

  manage_Response: (res, msg, what, act) => {
    if (obj.what == "formulation") {
    }
    if (obj.what == "generic") {
    }
    if (obj.what == "drug") {
    }
    if (obj.what == "group") {
    }
  },
};

module.exports = obj;
