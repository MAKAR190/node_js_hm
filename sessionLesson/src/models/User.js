const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);
User.methods.hashPassword = async function () {
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
};
User.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = model("user", User);
