//file này dùng để lưu trữ lịch sử trò chuyện
import mongoose from "mongoose";

const ChatLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    prompt: {
      type: String,
    },
    response: {
      type: String,
    },
    responseTime: {
      type: Number,
    },
    tokensUsed: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const ChatLog = mongoose.model("ChatLog", ChatLogSchema);

export default ChatLog;
