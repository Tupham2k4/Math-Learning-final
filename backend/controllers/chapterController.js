import Chapter from "../models/Chapter.js";
import Lesson from "../models/Lesson.js";
import Question from "../models/Question.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import mongoose from "mongoose";

// Hàm createChapter
export const createChapter = async (req, res) => {
  try {
    const { title, grade, order } = req.body;

    // Validate đầu vào
    if (!title || !grade || order === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp cả title, grade và order",
      });
    }

    // Tạo chapter mới
    const chapter = await Chapter.create({
      title,
      grade,
      order,
    });

    // Trả về success và dữ liệu chapter
    res.status(201).json({ success: true, data: chapter });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// Hàm getChapters (Lấy danh sách chapter, có hỗ trợ filter theo grade)
export const getChapters = async (req, res) => {
  try {
    const { grade } = req.query;

    // Khởi tạo bộ lọc (filter). Nếu không truyền grade thì lấy tất cả.
    let filter = {};
    if (grade) {
      filter.grade = grade;
    }

    // Tìm danh sách theo bộ lọc, sắp xếp tăng dần dựa trên trường 'order' (1)
    const chapters = await Chapter.find(filter).sort({ order: 1 });

    res.status(200).json({ success: true, data: chapters });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// Hàm updateChapter (Cập nhật thông tin title / order theo ID)
export const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;

    // Lọc cấu hình dữ liệu update (hạn chế các trường null ghi đè)
    let updateData = {};
    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = order;
    // Bổ sung linh tinh thêm grade nếu sau này có nhu cầu
    if (req.body.grade !== undefined) updateData.grade = req.body.grade;

    const chapter = await Chapter.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }, // Trả về kết quả mới sau khi update
    );

    if (!chapter) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy chapter để cập nhật",
        });
    }

    res.status(200).json({ success: true, data: chapter });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// 4. deleteChapter (Xoá chapter cascade)
export const deleteChapter = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    // Xoá kho đề (Exam)
    await Exam.deleteMany({ chapterId: id }).session(session);

    // Tìm lessons thuộc chapter
    const lessons = await Lesson.find({ chapterId: id }).session(session);
    const lessonIds = lessons.map(l => l._id);

    if (lessonIds.length > 0) {
      // Xóa bài tập (Questions)
      await Question.deleteMany({ lessonId: { $in: lessonIds } }).session(session);
      // Xoá kết quả (Result)
      await Result.deleteMany({ lessonId: { $in: lessonIds } }).session(session);
      // Xoá lesson (Bài giảng & Video Bài giảng)
      await Lesson.deleteMany({ chapterId: id }).session(session);
    }

    // Xoá Chapter gốc
    const chapter = await Chapter.findByIdAndDelete(id).session(session);

    if (!chapter) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Không tìm thấy chapter để xoá" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Đã xóa lesson và toàn bộ dữ liệu liên quan thành công." }); // Message custom theo mô tả lesson prompt của user để response chung, hoặc tuỳ chọn.
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "Có lỗi xảy ra khi xóa dữ liệu liên quan." });
  }
};

// Lấy thống kê dữ liệu liên quan để cảnh báo
export const getChapterRelatedData = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tìm lessons
    const lessons = await Lesson.find({ chapterId: id });
    const lessonCount = lessons.length;
    const videoCount = lessons.filter(l => l.videoUrl && l.videoUrl.trim() !== '').length;

    // Kho đề
    const khoDeCount = await Exam.countDocuments({ chapterId: id });

    // Bài tập
    const lessonIds = lessons.map(l => l._id);
    const baiTapCount = lessonIds.length > 0 ? await Question.countDocuments({ lessonId: { $in: lessonIds } }) : 0;

    res.status(200).json({
      success: true,
      data: {
        lessonsCount: lessonCount,
        baiGiangCount: lessonCount,
        videoBaiGiangCount: videoCount,
        baiTapCount: baiTapCount,
        khoDeCount: khoDeCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};
