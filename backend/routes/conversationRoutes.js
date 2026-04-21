import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  createConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

// Bắt buộc đăng nhập với tất cả các route của conversation
router.use(auth);

// Tạo cuộc trò chuyện mới
router.post("/", createConversation);

// Lấy danh sách cuộc trò chuyện của user hiện tại
router.get("/", getConversations);

// Lấy chi tiết một cuộc trò chuyện
router.get("/:id", getConversationById);

// Đổi tên cuộc trò chuyện
router.put("/:id", updateConversation);

// Xóa cuộc trò chuyện (xóa mềm)
router.delete("/:id", deleteConversation);

export default router;
