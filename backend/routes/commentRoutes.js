import express from "express";
import { getCommentsByVideo, createComment, deleteComment, getAllComments } from "../controllers/commentController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/comments/:videoId
 * @desc    Lấy tất cả bình luận video
 * @access  Public
 */
/**
 * @route   GET /api/comments
 * @desc    Lấy tất cả bình luận (Admin)
 * @access  Private
 */
router.get("/", getAllComments);

/**
 * @route   GET /api/comments/:videoId
 * @desc    Lấy tất cả bình luận video
 * @access  Public
 */
router.get("/:videoId", getCommentsByVideo);

/**
 * @route   POST /api/comments
 * @desc    Gửi bình luận mới hoặc phản hồi
 * @access  Private (Cần JWT)
 */
router.post("/", auth, createComment);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Xóa bình luận
 * @access  Private (Cần đúng chủ sở hữu)
 */
router.delete("/:id", auth, deleteComment);

export default router;
