const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  bookedUserId: { type: String, required: true },
  bookedUserEmail: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true },
  endDate: { type: Date, required: true },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Task", taskSchema);
