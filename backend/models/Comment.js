import mongoose from "mongoose";
import User from "./User.js"; 

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: String,
      ref: "Lesson",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Tự động populate user để lấy name và avatar khi fetch comment
commentSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name avatar",
  });
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
