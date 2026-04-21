import express from 'express';
import {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/dang-ky', registerUser);
router.post('/dang-nhap', loginUser);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
