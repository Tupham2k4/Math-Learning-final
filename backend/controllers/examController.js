import Exam from "../models/Exam.js";
import Chapter from "../models/Chapter.js";
import { v2 as cloudinary } from "cloudinary";
export const getExamsByChapter = async (req, res) => {
  try {
    const { grade, chapterId } = req.query;

    // Xây dựng query: type luôn là "chapter"
    const query = { type: "chapter" };

    if (grade) {
      query.grade = Number(grade);
    }
    if (chapterId) {
      query.chapterId = chapterId;
    }

    // Lấy danh sách exam theo điều kiện, populate chapterId và sắp xếp mới nhất (-1)
    const exams = await Exam.find(query)
      .populate("chapterId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đề thi",
      error: error.message,
    });
  }
};

// Lấy danh sách đề đặc biệt (Special Exams)
export const getSpecialExams = async (req, res) => {
  try {
    const { category } = req.query;

    // Xây dựng query: type luôn là "special"
    const query = { type: "special" };

    // Nếu client truyền category lên, thì thêm vào query để lọc
    if (category) {
      query.category = category;
    }

    // Lấy danh sách exam, sắp xếp mới nhất (-1)
    const exams = await Exam.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đề thi đặc biệt",
      error: error.message,
    });
  }
};

// Lấy chi tiết một đề thi theo ID
export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate("chapterId");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đề thi này",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết đề thi",
      error: error.message,
    });
  }
};

//Thêm nhiều đề cùng lúc

export const createExam = async (req, res) => {
  try {
    const {
      title,
      type,
      grade,
      chapterId,
      category,
      description,
      year,
      pdfUrl: existingPdfUrl,
    } = req.body;
    const createdBy = req.user?.id;

    // 1. Khai báo biến chứa URL cuối cùng
    let finalPdfUrl = existingPdfUrl;

    // 2. Logic kiểm tra File vs Link
    // Nếu không có link sẵn trong Body, thì mới bắt đầu kiểm tra File từ form-data
    if (!finalPdfUrl) {
      if (req.files && req.files.pdf && req.files.pdf.length > 0) {
        const pdfFile = req.files.pdf[0];

        // Upload lên Cloudinary (Dùng 'raw' để đảm bảo đúng định dạng tài liệu)
        const pdfResult = await cloudinary.uploader.upload(pdfFile.path, {
          resource_type: "raw",
          folder: "math_exams/pdfs",
        });
        finalPdfUrl = pdfResult.secure_url;
      }
    }

    // 3. Sau khi đã kiểm tra cả 2 nguồn mà vẫn không có URL thì mới báo lỗi
    if (!finalPdfUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng upload file PDF hoặc cung cấp đường dẫn PDF (pdfUrl).",
      });
    }

    // 4. Lưu vào Database
    const newExam = await Exam.create({
      title,
      type,
      grade,
      chapterId,
      category,
      description,
      year,
      pdfUrl: finalPdfUrl, // Sử dụng URL cuối cùng (từ File hoặc từ Link)
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Tạo đề thi thành công!",
      data: newExam,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra tồn tại
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đề thi này",
      });
    }

    // 2. Thực hiện xóa
    await exam.deleteOne();

    res.status(200).json({
      success: true,
      message: "Đã xóa đề thi thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa đề thi",
      error: error.message,
    });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, year, category } = req.body;

    // 1. Kiểm tra tồn tại
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đề thi này",
      });
    }

    // 2. Cập nhật các trường được phép (nếu có truyền lên)
    if (title !== undefined) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (year !== undefined) exam.year = year;
    if (category !== undefined) exam.category = category;

    const updatedExam = await exam.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật đề thi thành công",
      data: updatedExam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật đề thi",
      error: error.message,
    });
  }
};

export const createManyExams = async (req, res) => {
  try {
    const { exams } = req.body;
    const createdBy = req.user?.id;

    if (!exams || !Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp mảng danh sách đề thi (exams)",
      });
    }

    const formattedExams = exams.map((exam) => {
      // Validate dựa trên Schema mới
      if (!exam.title || !exam.type || !exam.pdfUrl) {
        throw new Error(
          "Mỗi đề thi cần có đủ nội dung tối thiểu: title, type, và pdfUrl",
        );
      }

      if (exam.type === "chapter" && (!exam.grade || !exam.chapterId)) {
        throw new Error(
          `Đề thi '${exam.title}' (loại chapter) thiếu trường grade hoặc chapterId`,
        );
      }

      if (exam.type === "special" && !exam.category) {
        throw new Error(
          `Đề/Tài liệu '${exam.title}' (loại special) thiếu trường category`,
        );
      }

      return {
        ...exam,
        createdBy,
      };
    });

    const insertedExams = await Exam.insertMany(formattedExams);

    res.status(201).json({
      success: true,
      message: `Thêm thành công ${insertedExams.length} đề thi`,
      data: insertedExams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi thêm nhiều đề thi",
    });
  }
};
