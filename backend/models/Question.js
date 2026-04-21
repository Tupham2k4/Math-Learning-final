import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  lessonId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Lesson",
    required:true,
  },
  type:{
    type: String,
    enum: ["mcq", "essay"], 
    require: true,
  },
  question:{
    type: String,
    required: true,
  },
  //Dùng cho trắc nghiệm
  options: [String],
  correctAnswer: String,
  //Dùng cho tự luận
  explanation: String,
  level:{
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  }, 
}, {timestamps: true});
export default mongoose.model("Question", questionSchema);

