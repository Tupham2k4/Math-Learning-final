import ChatLog from "../models/ChatLog.js";

// 1. Lấy toàn bộ ChatLog (cho Admin)
export const getAllChatLogs = async (req, res) => {
  try {
    const chatLogs = await ChatLog.find()
      .populate("userId", "name email") // Lấy field name và email ở collection User
      .populate("conversationId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      chatLogs,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách ChatLog:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};

// 2. Lấy log theo conversationId
export const getConversationLogs = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: "Thiếu conversationId" });
    }

    const chatLogs = await ChatLog.find({ conversationId })
      .populate("userId", "name email")
      .populate("conversationId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      chatLogs,
    });
  } catch (error) {
    console.error("Lỗi lấy log theo conversationId:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};

// 3. Xóa một ChatLog theo id
export const deleteChatLog = async (req, res) => {
  try {
    const { id } = req.params;

    const chatLog = await ChatLog.findByIdAndDelete(id);

    if (!chatLog) {
      return res.status(404).json({ success: false, message: "Không tìm thấy ChatLog" });
    }

    return res.status(200).json({
      success: true,
      message: "Đã xóa ChatLog thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa ChatLog:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};

// 4. Lấy dữ liệu thống kê Chatbot
export const getChatbotStats = async (req, res) => {
  try {
    const totalQuestions = await ChatLog.countDocuments();
    const totalUsersArray = await ChatLog.distinct("userId");
    const totalUsers = totalUsersArray.length;
    
    // Tính thời gian phản hồi trung bình (ms)
    const avgRs = await ChatLog.aggregate([
      { $group: { _id: null, avgTime: { $avg: "$responseTime" } } }
    ]);
    const avgResponseTime = avgRs.length > 0 ? Math.round(avgRs[0].avgTime) : 0;

    // Tính số lượng câu hỏi theo từng ngày (giới hạn 14 ngày gần nhất)
    const questionsPerDay = await ChatLog.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 14 }
    ]);

    const formattedQuestionsPerDay = questionsPerDay.map(q => ({
      date: q._id,
      count: q.count
    }));

    return res.status(200).json({
      success: true,
      totalQuestions,
      totalUsers,
      avgResponseTime,
      questionsPerDay: formattedQuestionsPerDay
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê Chatlog:", error);
    return res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
  }
};
