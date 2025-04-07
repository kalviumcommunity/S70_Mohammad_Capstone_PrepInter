const mongoose = require("mongoose");

const interviewSchema = mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, required: true }, 
  difficulty: { type: String, required: true, enum: ["Easy", "Medium", "Hard"] },
  type: { type: String, enum: ["technical", "behavioral"], default: "technical" },
  format: { type: String, enum: ["text", "audio"], default: "text" }, 
  suggestedAnswer: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
