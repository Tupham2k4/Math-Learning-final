import express from "express";
import {
  getLessonsByChapter,
  getLessonDetail,
  createLesson,
  createManyLessons,
  updateLesson,
  deleteLesson,
  getLessonRelatedData,
} from "../controllers/lessonController.js";
import { auth } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();
// Route gốc sẽ được setup tại file server.js là: /api/lessons
router.get("/", getLessonsByChapter);

// Lấy chi tiết bài học (Public)
router.get("/:id", getLessonDetail);

// Các route dành riêng cho Admin (Phải đăng nhập bằng tài khoản có role='admin')
router.post("/", auth, adminMiddleware, createLesson);
// Thêm nhiều lesson cùng lúc (Admin)
router.post("/bulk", auth, adminMiddleware, createManyLessons);
router.put("/:id", auth, adminMiddleware, updateLesson);
router.get("/:id/related", auth, adminMiddleware, getLessonRelatedData);
router.delete("/:id", auth, adminMiddleware, deleteLesson);

export default router;
