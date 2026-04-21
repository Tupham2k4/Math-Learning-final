import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tên đề thi/tài liệu"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      required: [true, "Vui lòng chọn loại đề thi (type)"],
      enum: {
        values: ["chapter", "special"],
        message: "{VALUE} không hợp lệ, type phải là 'chapter' hoặc 'special'",
      },
    },
    grade: {
      type: Number,
      min: [1, "Khối lớp nhỏ nhất là 1"],
      max: [12, "Khối lớp lớn nhất là 12"],
      required: function () {
        return this.type === "chapter";
      },
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: function () {
        return this.type === "chapter";
      },
    },
    category: {
      type: String,
      enum: {
        values: ["vao10", "thpt", "hsg", "thi_thu", "khac"],
        message: "{VALUE} không phải là danh mục hợp lệ",
      },
      required: function () {
        return this.type === "special";
      },
    },
    pdfUrl: {
      type: String,
      required: [true, "Vui lòng cung cấp link PDF (Cloudinary)"],
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: Number,
      min: [2000, "Năm không hợp lệ"],
      max: [new Date().getFullYear() + 1, "Năm vượt quá hiện tại"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Tạo và Export thành ES Module chuẩn
const Exam = mongoose.model("Exam", examSchema);

export default Exam;