// models/AssessmentResult.js

import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.ObjectId, // key: questionId, value: selectedOptionId
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const AssessmentResult = mongoose.model("AssessmentResult", assessmentResultSchema);
