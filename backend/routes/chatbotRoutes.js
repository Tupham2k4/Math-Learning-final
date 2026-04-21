import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { sendMessage, getSuggestions } from "../controllers/chatbotController.js";

const router = express.Router();

// Lấy danh sách câu hỏi gợi ý (không bắt buộc đăng nhập để xem)
router.get("/suggestions", getSuggestions);

// Bắt buộc đăng nhập để gửi tin nhắn
router.use(auth);

// Gửi tin nhắn đến chatbot (yêu cầu body có message và tùy chọn conversationId)
router.post("/send", sendMessage);

export default router;
