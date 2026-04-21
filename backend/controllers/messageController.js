import Message from "../models/Message.js";

// Lấy tất cả message theo conversationId
export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ 
        success: false, 
        message: "Thiếu conversationId" 
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }); // Sắp xếp cũ nhất trước (theo thứ tự tin nhắn gửi lên)

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách message:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi server nội bộ" 
    });
  }
};
