import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "essay"],
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        points: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "graded"],
      default: "graded",
    },
    score: {
      type: Number,
      default: 0,
    },
    teacherFeedback: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Result", resultSchema);
