const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = mongoose.model(
  "users",
  Schema({
    name: {
      type: String,
      min: 4,
      max: 100,
      required: true,
    },
    email: {
      type: String,
      min: 25,
      max: 200,
      required: true,
    },
    password: {
      type: String,
      min: 6,
      max: 1024,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  })
);
const tokenModel = mongoose.model(
  "token",
  Schema({
    userId: {
      type: String, //mongoose.Schema.Types.ObjectId,
      // ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expires: {
      type: String,
    },
  })
);

module.exports = { tokenModel, userModel };
