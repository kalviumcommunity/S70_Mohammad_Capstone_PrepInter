const mongoose = require("mongoose");

const interviewSessionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  qaPairs: [
    {
      question: { type: String, required: true },
      answer: { type: String }, 
    },
  ],
  scores: [{ type: Number }], 
  duration: { type: Number }, 
  result: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
