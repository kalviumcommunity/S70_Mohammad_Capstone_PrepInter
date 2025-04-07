const mongoose = require("mongoose");

const interviewSessionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interview" }],
  answers: [{ type: String }],
  scores: [{ type: Number }], 
  duration: { type: Number }, 
  result: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
