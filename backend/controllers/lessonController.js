import Lesson from "../models/Lesson.js";
import Chapter from "../models/Chapter.js";
import Question from "../models/Question.js";
import mongoose from "mongoose";
import Result from "../models/Result.js";

// 1. Tạo lesson mới
export const createLesson = async (req, res) => {
  try {
    const { title, chapterId, videoUrl, content, thumbnail, order } = req.body;

    // Validate đầu vào
    if (!title || !chapterId || order === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp cả title, chapterId và order",
      });
    }

    // KIỂM TRA: Xem chapterId có thực sự tồn tại dưới Database không
    const chapterExists = await Chapter.findById(chapterId);
    if (!chapterExists) {
      return res.status(404).json({
        success: false,
        message: "Chương học (chapterId) không tồn tại. Vui lòng kiểm tra lại!",
      });
    }

    // Tạo lesson mới
    const lesson = await Lesson.create({
      title,
      chapterId,
      videoUrl,
      content,
      thumbnail,
      order,
    });

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// 2. Lấy danh sách lesson theo chapter (từ query)
export const getLessonsByChapter = async (req, res) => {
  try {
    // Lấy trực tiếp từ query
    const { chapterId } = req.query;

    // Xây dựng câu truy vấn linh hoạt nếu có chapterId
    let query = {};
    if (chapterId) {
      query.chapterId = chapterId;
    }

    const lessons = await Lesson.find(query)
      .populate("chapterId", "title grade")
      .sort({ order: 1 });
    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// 3. Lấy chi tiết một lesson
export const getLessonDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài học này" });
    }

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// 4. Cập nhật lesson
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      req.body, 
      { new: true, runValidators: true }, 
    );

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lesson để cập nhật" });
    }

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// 5. Xóa lesson (Cascade Xóa bài tập, Kết quả)
export const deleteLesson = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    // Xoá bài tập (Questions)
    await Question.deleteMany({ lessonId: id }).session(session);
    
    // Xoá kết quả thi liên quan
    await Result.deleteMany({ lessonId: id }).session(session);

    // Xoá Lesson gốc
    const lesson = await Lesson.findByIdAndDelete(id).session(session);

    if (!lesson) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lesson để xóa" });
    }

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ success: true, message: "Đã xóa lesson và toàn bộ dữ liệu liên quan thành công." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ success: false, message: "Có lỗi xảy ra khi xóa dữ liệu liên quan." });
  }
};

// Lấy thống kê dữ liệu liên quan để hiển thị modal cảnh báo trước khi xoá
export const getLessonRelatedData = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lesson" });
    }

    const baiTapCount = await Question.countDocuments({ lessonId: id });

    res.status(200).json({
      success: true,
      data: {
        baiGiangCount: 1, // Bản thân nó là 1 bài giảng
        videoBaiGiangCount: (lesson.videoUrl && lesson.videoUrl.trim() !== '') ? 1 : 0,
        baiTapCount: baiTapCount,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};
//6. Thêm nhiều json lesson cùng lúc
export const createManyLessons = async (req, res) => {
  try {
    const lessonsData = req.body; // Mong muốn nhận một mảng các lesson từ body

    if (!Array.isArray(lessonsData) || lessonsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu body phải là một mảng các lesson",
      });
    }

    // Có thể thêm validate từng lesson trong mảng nếu cần thiết trước khi insertMany
    const insertedLessons = await Lesson.insertMany(lessonsData);

    res.status(201).json({
      success: true,
      data: insertedLessons,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
