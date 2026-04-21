import rateLimit from "express-rate-limit";

export const chatbotRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 100,
  message: {
    success: false,
    message: "Bạn gửi tin nhắn quá nhanh, vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});