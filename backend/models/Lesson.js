import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề bài học"],
    },
    description: {
      type: String,
      default: "",
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter", 
      required: [true, "Vui lòng chọn hoặc cung cấp ID chương học"],
    },
    videoUrl: {
      type: String,
    },
    content: {
      mucTieu: {
        type: String,
        default: "",
      },
      khaiNiem: {
        type: String,
        default: "",
      },
      viDu: {
        type: String,
        default: "",
      },
      ghiNho: {
        type: String,
        default: "",
      },
    },
    thumbnail: {
      type: String,
    },
    order: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
