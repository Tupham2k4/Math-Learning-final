//file này dùng để xử lý logic gửi tin nhắn và nhận phản hồi từ AI
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import ChatLog from "../models/ChatLog.js";
import { generateWithFallback, systemInstruction } from "../config/gemini.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    
    const userId = req.user ? (req.user.id || req.user._id) : null;

    // 2. Kiểm tra message có tồn tại không
    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Tin nhắn không được để trống" });
    }

    let conversation;

    // 3. Nếu không có conversationId thì tạo Conversation mới
    if (!conversationId) {
      conversation = new Conversation({
        userId,
        title: "Cuộc trò chuyện mới",
        lastMessage: message,
      });
      await conversation.save();
    } else {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
      }
    }

    const actualConversationId = conversation._id;

    // 4. Lưu message của user vào collection Message
    const userMessage = new Message({
      conversationId: actualConversationId,
      sender: "user",
      content: message,
    });
    await userMessage.save();

    // Bắt đầu đếm thời gian từ lúc gửi API
    const startTime = Date.now();
    let responseText = "";
    let tokensUsed = 0;

    try {
      const fullPrompt = `${systemInstruction}\n\nCâu hỏi của người dùng:\n${message}`;
      
      const result = await generateWithFallback(fullPrompt);
      responseText = result.text;
      tokensUsed = result.usageMetadata?.totalTokenCount || 0;

    } catch (finalError) {
      console.error("Gemini API Error (All Models Failed):", finalError.message);
      return res.status(500).json({ 
        success: false, 
        message: "AI hiện tại đang bảo trì hoặc hết hạn hạn mức (Quota), vui lòng thử lại sau 1 phút.",
        error: finalError.message
      });
    }

    const responseTime = Date.now() - startTime;

    // 7. Lưu message bot vào collection Message
    const botMessage = new Message({
      conversationId: actualConversationId,
      sender: "bot",
      content: responseText,
    });
    await botMessage.save();

    // 8. Cập nhật lastMessage của Conversation
    conversation.lastMessage = message; 

    // 9. Nếu title của Conversation vẫn là "Cuộc trò chuyện mới" thì tự động lấy 5-8 từ đầu tiên của message user làm title
    if (conversation.title === "Cuộc trò chuyện mới") {
      const words = message.trim().split(/\s+/);
      let newTitle = words.slice(0, 6).join(" "); // Lấy 6 từ (5-8 từ)
      if (words.length > 6) {
        newTitle += "...";
      }
      conversation.title = newTitle;
    }

    await conversation.save();

    // 10. Lưu log vào ChatLog
    const chatLog = new ChatLog({
      userId,
      conversationId: actualConversationId,
      prompt: message,
      response: responseText,
      responseTime,
      tokensUsed,
    });
    await chatLog.save();

    // 11. Trả response
    return res.status(200).json({
      success: true,
      conversationId: actualConversationId,
      userMessage,
      botMessage,
    });

  } catch (error) {
    console.error("Lỗi trong hàm sendMessage:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ", error: error.message, stack: error.stack });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "Giải phương trình bậc 2",
      "Tính đạo hàm của sin(x)",
      "Vẽ đồ thị y = x^2",
      "Chứng minh tam giác cân"
    ];
    return res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error("Lỗi trong hàm getSuggestions:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};
