const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Already in Use"],
    validate(val) {
      if (!validator.isEmail(val)) {
        return "please enter valid email";
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  date_of_birth: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
