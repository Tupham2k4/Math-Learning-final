import Comment from "../models/Comment.js";

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name username fullname")
      .populate({
        path: "videoId",
        select: "title chapterId",
        populate: {
          path: "chapterId",
          select: "grade"
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedComments = comments.map(comment => {
      return {
        ...comment,
        grade: comment.videoId?.chapterId?.grade || null
      };
    });

    res.status(200).json({
      success: true,
      data: formattedComments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách tất cả bình luận",
      error: error.message,
    });
  }
};

export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Lấy tất cả bình luận của video, sắp xếp mới nhất ở đầu
    const comments = await Comment.find({ videoId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bình luận",
      error: error.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content, videoId, parentComment } = req.body;
    const userId = req.user.id; // Lấy từ authMiddleware

    if (!content || !videoId) {
      return res.status(400).json({
        success: false,
        message: "Nội dung và videoId là bắt buộc",
      });
    }

    const newComment = await Comment.create({
      content,
      user: userId,
      videoId,
      parentComment: parentComment || null,
    });

    // Populate user để trả về preview đầy đủ cho frontend cập nhật UI ngay lập tức
    const populatedComment = await newComment.populate({
      path: "user",
      select: "name avatar",
    });

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo bình luận",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bình luận" });
        }

        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Bạn không có quyền xóa bình luận này" });
        }
        
        await Comment.deleteMany({ parentComment: comment._id });
        await comment.deleteOne();

        res.status(200).json({ success: true, message: "Đã xóa bình luận" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
