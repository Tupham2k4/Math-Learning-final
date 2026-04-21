import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllChatLogs,
  getConversationLogs,
  deleteChatLog,
  getChatbotStats,
} from "../controllers/adminChatController.js";

const router = express.Router();

// Bắt buộc đăng nhập và phải có quyền admin
router.use(auth, adminMiddleware);

// Lấy danh sách toàn bộ ChatLog
router.get("/logs", getAllChatLogs);

// Lấy thống kê Chatbot
router.get("/stats", getChatbotStats);

// Lấy xem chi tiết log của một conversation
router.get("/logs/:conversationId", getConversationLogs);

// Xóa một ChatLog
router.delete("/logs/:id", deleteChatLog);

export default router;
