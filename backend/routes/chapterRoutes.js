import express from 'express';
import {
    getChapters,
    createChapter,
    updateChapter,
    deleteChapter,
    getChapterRelatedData
} from '../controllers/chapterController.js';
import { auth } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();
// Route gốc sẽ được setup tại file server.js là: /api/chapters
router.get('/', getChapters);

// Các route dành riêng cho Admin (Phải đăng nhập bằng tài khoản có role='admin')
router.post('/', auth, adminMiddleware, createChapter);
router.put('/:id', auth, adminMiddleware, updateChapter);
router.get('/:id/related', auth, adminMiddleware, getChapterRelatedData);
router.delete('/:id', auth, adminMiddleware, deleteChapter);

export default router;
