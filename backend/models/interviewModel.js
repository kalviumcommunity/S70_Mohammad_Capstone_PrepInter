const mongoose = require('mongoose');
const interviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['frontend', 'backend', 'fullstack'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please add a difficulty level'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        aiGenerated: {
          type: Boolean,
          default: true,
        },
        answer: {
          type: String,
          default: '',
        },
        feedback: {
          type: String,
          default: '',
        },
      },
    ],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Interview', interviewSchema);