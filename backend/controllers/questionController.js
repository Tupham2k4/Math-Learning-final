import Question from "../models/Question.js";

export const getQuestionsByLesson = async (req, res) => {
  try {
    const { lessonId } = req.query;
    
    // Nếu có lessonId thì filter, nếu không thì lấy toàn bộ (phục vụ cho màn hình Thống kê tổng)
    let query = {};
    if (lessonId) {
        query.lessonId = lessonId;
    }

    const questions = await Question.find(query)
        .populate({
             path: 'lessonId',
             select: 'title grade chapterId',
             populate: {
                 path: 'chapterId',
                 select: 'title grade'
             }
        });
    
    res.status(200).json({
        success: true,
        data: questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createQuestion = async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        
        res.status(201).json({
            success: true,
            data: savedQuestion
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createManyQuestions = async (req, res) => {
    try {
        const questionsData = req.body;
        
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Dữ liệu body phải là một mảng các câu hỏi" 
            });
        }
        
        const insertedQuestions = await Question.insertMany(questionsData);
        
        res.status(201).json({
            success: true,
            data: insertedQuestions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
             return res.status(404).json({ success: false, message: "Không tìm thấy bài tập" });
        }

        res.status(200).json({
            success: true,
            data: deletedQuestion,
            message: "Xóa bài tập thành công"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
             return res.status(404).json({ success: false, message: "Không tìm thấy bài tập" });
        }

        res.status(200).json({
            success: true,
            data: updatedQuestion,
            message: "Cập nhật bài tập thành công"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};