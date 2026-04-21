import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề"],
    },
    grade: {
      type: String,
      required: [true, "Vui lòng nhập khối lớp"],
    },
    order: {
      type: Number,
      required: [true, "Vui lòng nhập thứ tự"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Tự động quản lý createdAt và updatedAt
  },
);

export default mongoose.model("Chapter", chapterSchema);
