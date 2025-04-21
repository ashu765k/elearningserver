import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String
    }
  ]
});

export const Assessment = mongoose.model("Assessment", assessmentSchema);
