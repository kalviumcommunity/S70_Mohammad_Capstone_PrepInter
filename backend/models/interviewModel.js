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
      enum: ['behavioral', 'technical', 'situational', 'Soft Skills'],
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
        skipped: {
          type: Boolean,
          default: false,
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
    completedAt: {
      type: Date,
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