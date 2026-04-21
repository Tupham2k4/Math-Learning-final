//file này dùng để xử lý logic tạo, lấy, update, delete conversation
import Conversation from "../models/Conversation.js";

// 1. Tạo cuộc trò chuyện mới
export const createConversation = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : null;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Người dùng chưa đăng nhập" });
    }

    const newConversation = new Conversation({
      userId,
      title: "Cuộc trò chuyện mới",
    });

    await newConversation.save();

    return res.status(201).json({
      success: true,
      message: "Tạo cuộc trò chuyện thành công",
      conversation: newConversation,
    });
  } catch (error) {
    console.error("Lỗi tạo conversation:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};

// 2. Lấy danh sách conversation theo userId
export const getConversations = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : null;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Người dùng chưa đăng nhập" });
    }

    const conversations = await Conversation.find({ userId, isDeleted: false })
      .sort({ updatedAt: -1 }); 

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách conversation:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};

// 3. Lấy chi tiết một conversation theo id
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findOne({ _id: id, isDeleted: false })
      .populate("userId", "fullName email"); 

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết conversation:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};

// 4. Update conversation (Đổi title)
export const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Vui lòng nhập title mới" });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { title: title.trim() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật title thành công",
      conversation,
    });
  } catch (error) {
    console.error("Lỗi cập nhật conversation:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};

// 5. Delete conversation (Xóa mềm)
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
    }

    return res.status(200).json({
      success: true,
      message: "Đã xóa cuộc trò chuyện",
    });
  } catch (error) {
    console.error("Lỗi xóa conversation:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};
