const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  apikey: { type: String, required: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
});

let User = mongoose.model("User", UserSchema);

module.exports = { User, UserSchema };
