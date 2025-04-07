const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
