import Result from "../models/Result.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const submitQuiz = async (req, res) => {
  try {
    const { lessonId, answers, userId } = req.body;

    // Kiểm tra cơ bản để trả về lỗi hữu ích thay vì 500
    if (!lessonId) {
      return res
        .status(400)
        .json({ success: false, message: "lessonId là bắt buộc" });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "câu trả lời là bắt buộc và phải là một mảng",
      });
    }

    if (answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "danh sách câu trả lời không được rỗng",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId là bắt buộc (vui lòng đăng nhập)",
      });
    }

    // Lấy danh sách câu hỏi gốc từ mảng questionId frontend gửi lên
    const questionIds = answers
      .map((a) => (a?.questionId ? String(a.questionId) : null))
      .filter(Boolean);

    const questions = await Question.find({
      _id: { $in: questionIds },
      lessonId,
    });

    const questionMap = new Map(questions.map((q) => [String(q._id), q]));

    let score = 0;
    const reviewResults = [];
    const processedAnswers = [];
    const totalMcqQuestions = questions.filter((q) => q.type === "mcq").length;
    const totalEssayQuestions = questions.filter((q) => q.type === "essay").length;
    const mcqPointPerQuestion =
      totalMcqQuestions > 0 ? 10 / totalMcqQuestions : 0;

    let hasMcq = false;
    let hasEssay = false;

    answers.forEach((submittedAnswer) => {
      if (!submittedAnswer || !submittedAnswer.questionId) return;

      const questionId = String(submittedAnswer.questionId);
      const q = questionMap.get(questionId);
      if (!q) return;

      const userAnswer =
        typeof submittedAnswer.answer === "undefined"
          ? ""
          : String(submittedAnswer.answer);
      let isCorrect = false;
      let points = 0;

      if (q.type === "mcq") {
        hasMcq = true;
        const normalizeStr = (str) => String(str).trim().toLowerCase();
        
        const uaString = normalizeStr(userAnswer);
        const caString = normalizeStr(q.correctAnswer);

        let isMatch = uaString === caString;

        if (!isMatch && Array.isArray(q.options)) {
          const uaIndex = Number(userAnswer);
          if (!isNaN(uaIndex) && uaIndex >= 0 && uaIndex < q.options.length) {
            const optionText = normalizeStr(q.options[uaIndex]);
            if (optionText === caString) {
              isMatch = true;
            } else {
              // Hỗ trợ trường hợp admin nhập correctAnswer là A, B, C, D
              const letterMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
              if (letterMap.hasOwnProperty(caString) && letterMap[caString] === uaIndex) {
                isMatch = true;
              }
            }
          }
        }

        isCorrect = isMatch;
        if (isCorrect) {
          points = mcqPointPerQuestion;
          score += mcqPointPerQuestion;
        }
      } else if (q.type === "essay") {
        hasEssay = true;
        points = 0;
      }

      reviewResults.push({
        questionId: q._id,
        type: q.type,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswer,
        points,
        isCorrect: isCorrect,
      });

      processedAnswers.push({
        questionId: q._id,
        answer: userAnswer,
        points,
      });
    });

    if (hasMcq && hasEssay) {
      return res.status(400).json({
        success: false,
        message: "Mỗi lần nộp chỉ hỗ trợ một loại bài: trắc nghiệm hoặc tự luận",
      });
    }

    const submissionType = hasEssay || totalEssayQuestions > 0 ? "essay" : "mcq";
    const existingResult = await Result.findOne({
      userId: String(userId),
      lessonId,
      type: submissionType,
    }).sort({ createdAt: -1 });

    const finalAnswers = processedAnswers.map((ans) => ({
      ...ans,
      feedback: existingResult?.answers?.find(
        (oldAns) => String(oldAns.questionId) === String(ans.questionId),
      )?.feedback,
    }));

    const finalScore = Number(score.toFixed(2));
    const status = submissionType === "essay" ? "pending" : "graded";

    const result =
      existingResult ||
      new Result({
        userId: String(userId),
        lessonId,
        type: submissionType,
      });

    result.answers = finalAnswers;
    result.status = status;
    result.score = finalScore;
    result.type = submissionType;
    if (status === "pending") {
      result.teacherFeedback = "";
    }

    await result.save();

    res.json({
      success: true,
      status,
      score: finalScore,
      results: reviewResults,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPendingResults = async (req, res) => {
  try {
    const pendingResults = await Result.find({ status: "pending" })
      .populate("lessonId", "title")
      .sort({ createdAt: -1 });

    const userIds = [
      ...new Set(
        pendingResults.map((result) => String(result.userId)).filter(Boolean),
      ),
    ];

    const users = await User.find({ _id: { $in: userIds } }).select("name");
    const userMap = new Map(users.map((user) => [String(user._id), user]));

    const resultsWithRelations = pendingResults.map((result) => {
      const user = userMap.get(String(result.userId));
      return {
        ...result.toObject(),
        user: user ? { _id: user._id, name: user.name } : null,
        lesson: result.lessonId
          ? { _id: result.lessonId._id, title: result.lessonId.title }
          : null,
      };
    });

    return res.json({
      success: true,
      count: resultsWithRelations.length,
      results: resultsWithRelations,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllResults = async (req, res) => {
  try {
    const allResults = await Result.find()
      .populate("lessonId", "title")
      .populate("answers.questionId", "type")
      .sort({ createdAt: -1 });

    const userIds = [
      ...new Set(
        allResults.map((result) => String(result.userId)).filter(Boolean),
      ),
    ];

    const users = await User.find({ _id: { $in: userIds } }).select("name");
    const userMap = new Map(users.map((user) => [String(user._id), user]));

    const resultsWithRelations = allResults.map((result) => {
      const user = userMap.get(String(result.userId));
      
      const hasEssay = result.answers?.some(
        (ans) => ans.questionId && ans.questionId.type === "essay"
      );
      const hasMcq = result.answers?.some(
        (ans) => ans.questionId && ans.questionId.type === "mcq"
      );
      
      return {
        ...result.toObject(),
        type:
          result.type ||
          (hasEssay ? "essay" : "mcq"),
        hasEssay: !!hasEssay,
        hasMcq: !!hasMcq,
        user: user ? { _id: user._id, name: user.name } : null,
        lesson: result.lessonId
          ? { _id: result.lessonId._id, title: result.lessonId.title }
          : null,
      };
    });

    return res.json({
      success: true,
      count: resultsWithRelations.length,
      results: resultsWithRelations,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getResultDetail = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findById(resultId)
      .populate("lessonId", "title")
      .populate(
        "answers.questionId",
        "question type correctAnswer options explanation",
      );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài làm" });
    }

    const user = await User.findById(result.userId).select("name");

    return res.json({
      success: true,
      result: {
        ...result.toObject(),
        user: user ? { _id: user._id, name: user.name } : null,
        lesson: result.lessonId
          ? { _id: result.lessonId._id, title: result.lessonId.title }
          : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const gradeResultByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { gradedAnswers, teacherFeedback } = req.body;

    if (!Array.isArray(gradedAnswers)) {
      return res.status(400).json({
        success: false,
        message: "gradedAnswers là bắt buộc và phải là một mảng",
      });
    }

    const result = await Result.findById(id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài làm" });
    }

    const gradingMap = new Map(
      gradedAnswers
        .filter((item) => item && item.questionId)
        .map((item) => [String(item.questionId), item]),
    );

    result.answers = result.answers.map((answerItem) => {
      const answerQuestionId = String(answerItem.questionId);
      const gradedItem = gradingMap.get(answerQuestionId);

      if (!gradedItem) return answerItem;

      const parsedPoints = Number(gradedItem.points);
      answerItem.points = Number.isNaN(parsedPoints) ? 0 : parsedPoints;

      if (typeof gradedItem.feedback !== "undefined") {
        answerItem.feedback = String(gradedItem.feedback);
      }

      return answerItem;
    });

    result.score = result.answers.reduce((total, answerItem) => {
      const points = Number(answerItem.points);
      return total + (Number.isNaN(points) ? 0 : points);
    }, 0);

    result.status = "graded";
    result.teacherFeedback =
      typeof teacherFeedback === "undefined" ? "" : String(teacherFeedback);

    await result.save();

    const populatedResult = await Result.findById(result._id)
      .populate("lessonId", "title")
      .populate(
        "answers.questionId",
        "question type correctAnswer options explanation",
      );

    return res.json({
      success: true,
      message: "Đã cập nhật chấm điểm bài thi",
      result: populatedResult,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getResultStatsOverview = async (req, res) => {
  try {
    const summaryAgg = await Result.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "answers.questionId",
          foreignField: "_id",
          as: "questionDocs",
        },
      },
      {
        $addFields: {
          hasMcq: { $in: ["mcq", "$questionDocs.type"] },
          hasEssay: { $in: ["essay", "$questionDocs.type"] },
          normalizedType: {
            $cond: [
              { $in: ["$type", ["mcq", "essay"]] },
              "$type",
              { $cond: [{ $eq: [{ $in: ["essay", "$questionDocs.type"] }, true] }, "essay", "mcq"] },
            ],
          },
        },
      },
      {
        $addFields: {
          normalizedStatus: {
            $cond: [
              { $in: ["$status", ["pending", "graded"]] },
              "$status",
              { $cond: [{ $eq: ["$hasEssay", true] }, "pending", "graded"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalResults: { $sum: 1 },
          totalMcqResults: {
            $sum: { $cond: [{ $eq: ["$normalizedType", "mcq"] }, 1, 0] },
          },
          totalEssayResults: {
            $sum: { $cond: [{ $eq: ["$normalizedType", "essay"] }, 1, 0] },
          },
          pendingResults: {
            $sum: { $cond: [{ $eq: ["$normalizedStatus", "pending"] }, 1, 0] },
          },
          gradedResults: {
            $sum: { $cond: [{ $eq: ["$normalizedStatus", "graded"] }, 1, 0] },
          },
          gradedScoreSum: {
            $sum: {
              $cond: [
                { $eq: ["$normalizedStatus", "graded"] },
                { $ifNull: ["$score", 0] },
                0,
              ],
            },
          },
        },
      },
    ]);

    const summary = summaryAgg[0] || {
      totalResults: 0,
      totalMcqResults: 0,
      totalEssayResults: 0,
      pendingResults: 0,
      gradedResults: 0,
      gradedScoreSum: 0,
    };

    const averageScoreRaw =
      summary.gradedResults > 0
        ? summary.gradedScoreSum / summary.gradedResults
        : 0;
    const averageScore = Number(averageScoreRaw.toFixed(2));

    return res.json({
      success: true,
      data: {
        totalResults: summary.totalResults,
        totalMcqResults: summary.totalMcqResults,
        totalEssayResults: summary.totalEssayResults,
        pendingResults: summary.pendingResults,
        gradedResults: summary.gradedResults,
        averageScore,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getLatestResultByUserAndLesson = async (req, res) => {
  try {
    const { userId, lessonId, type } = req.query;

    if (!userId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "userId và lessonId là bắt buộc",
      });
    }

    const query = { userId: String(userId), lessonId };
    if (type === "mcq" || type === "essay") {
      query.type = type;
    }

    const result = await Result.findOne(query)
      .sort({ createdAt: -1 })
      .populate("lessonId", "title")
      .populate(
        "answers.questionId",
        "question type correctAnswer options explanation",
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kết quả bài làm",
      });
    }

    return res.json({
      success: true,
      result,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findById(id);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài làm để xóa" });
    }

    await Result.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Đã xóa bài làm thành công",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
