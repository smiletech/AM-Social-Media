
const { date } = require("joi");
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minLength: 4,
  },
  lastname: {
    type: String,
    required: true,
    minLength: 4,
  },
  biodata: {
    type: String,
  },
  gender: {
    type: String,

  },
  dateofbirth: {
    type: String,

  },
  mobile: {
    type: String
  },
  email: {
    type: String,
    required: true,
    minLength: 4,

  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  img: {
    type: String,

  }

}
  , { timestamps: true });

module.exports = mongoose.model("MUser", userSchema);
