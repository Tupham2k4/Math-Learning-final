import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { getMessagesByConversation } from "../controllers/messageController.js";

const router = express.Router();

// Bắt buộc đăng nhập
router.use(auth);

// Lấy danh sách tin nhắn theo conversationId
router.get("/:conversationId", getMessagesByConversation);

export default router;
