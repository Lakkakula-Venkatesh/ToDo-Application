const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: false },
  lastSignInAt: { type: Date, required: false },
  currentSignInAt: { type: Date, required: true },
  oldPasswords: { type: [String], required: false },
  resetPasswordToken: { type: String, required: false }
});

module.exports = mongoose.model("User", userSchema);
