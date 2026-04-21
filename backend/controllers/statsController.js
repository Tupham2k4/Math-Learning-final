import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';

export const getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'user' }); 
        const lessonCount = await Lesson.countDocuments();
        const videoCount = await Lesson.countDocuments({ 
            videoUrl: { $exists: true, $ne: "" } 
        });
        const examCount = await Exam.countDocuments();
        const questionCount = await Question.countDocuments();
        const results = await Result.aggregate([
            { $match: { status: { $ne: "pending" } } },
            { $group: { 
                _id: null, 
                avgScore: { $avg: "$score" },
                maxScore: { $max: "$score" },
                minScore: { $min: "$score" },
                totalCount: { $sum: 1 },
                passedCount: { $sum: { $cond: [{ $gte: ["$score", 5] }, 1, 0] } }
            } }
        ]);
        
        let averageScore = 0;
        let highestScore = 0;
        let lowestScore = 0;
        let passRate = 0;

        if (results.length > 0 && results[0].avgScore != null) {
            averageScore = Number(results[0].avgScore.toFixed(2));
            highestScore = Number(results[0].maxScore.toFixed(2));
            lowestScore = Number(results[0].minScore.toFixed(2));
            // Tính tỷ lệ đạt (pass rate)
            if (results[0].totalCount > 0) {
                passRate = Math.round((results[0].passedCount / results[0].totalCount) * 100);
            }
        }

        // Tính điểm trung bình
        const gradeScoresAgg = await Result.aggregate([
            { $match: { status: { $ne: "pending" } } },
            {
                $lookup: {
                    from: "lessons",            
                    localField: "lessonId",
                    foreignField: "_id",
                    as: "lesson"
                }
            },
            { $unwind: "$lesson" },
            {
                $lookup: {
                    from: "chapters",        
                    localField: "lesson.chapterId",
                    foreignField: "_id",
                    as: "chapter"
                }
            },
            { $unwind: "$chapter" },
            {
                $group: {
                    _id: "$chapter.grade",
                    avgScore: { $avg: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    grade: "$_id",
                    avgScore: { $round: ["$avgScore", 2] }
                }
            },
            { $sort: { grade: 1 } } 
        ]);

        const recentActivities = await Result.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
                $addFields: {
                    userObjId: { $toObjectId: "$userId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userObjId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "lessons",
                    localField: "lessonId",
                    foreignField: "_id",
                    as: "lesson"
                }
            },
            { $unwind: { path: "$lesson", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "chapters",
                    localField: "lesson.chapterId",
                    foreignField: "_id",
                    as: "chapter"
                }
            },
            { $unwind: { path: "$chapter", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    userName: "$user.name",
                    lessonTitle: "$lesson.title",
                    grade: "$chapter.grade",
                    score: 1,
                    createdAt: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            userCount,
            lessonCount,
            videoCount,
            examCount,
            questionCount,
            averageScore,
            highestScore,
            lowestScore,
            passRate,
            gradeScores: gradeScoresAgg,
            recentActivities
        });
    } catch (error) {
        console.error("Error getting dashboard stats:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getGradeCounts = async (req, res) => {
    try {
        const countsByGrade = {};
        for (let i = 1; i <= 12; i++) {
            countsByGrade[i] = { lessons: 0, videos: 0, exams: 0, questions: 0 };
        }

        const extractGradeNumber = (val) => {
            if (!val) return null;
            const match = String(val).match(/\d+/);
            return match ? Number(match[0]) : null;
        };

        // 1. Exams
        const exams = await Exam.find().lean();
        exams.forEach(ex => {
            const grade = extractGradeNumber(ex.grade);
            if (grade && countsByGrade[grade]) countsByGrade[grade].exams++;
        });

        // 2. Lessons & Videos
        const lessons = await Lesson.find().populate("chapterId").lean();
        lessons.forEach(ls => {
            if (ls.chapterId && ls.chapterId.grade != null) {
                const grade = extractGradeNumber(ls.chapterId.grade);
                if (grade && countsByGrade[grade]) {
                    countsByGrade[grade].lessons++;
                    if (ls.videoUrl && ls.videoUrl !== "") {
                        countsByGrade[grade].videos++;
                    }
                }
            }
        });

        // 3. Questions (Bài tập)
        const questions = await Question.find()
            .populate({
                path: "lessonId",
                populate: { path: "chapterId" }
            }).lean();
            
        questions.forEach(q => {
            if (q.lessonId && q.lessonId.chapterId && q.lessonId.chapterId.grade != null) {
                const grade = extractGradeNumber(q.lessonId.chapterId.grade);
                if (grade && countsByGrade[grade]) {
                    countsByGrade[grade].questions++;
                }
            }
        });

        res.status(200).json({ success: true, countsByGrade });
    } catch (error) {
        console.error("Error getting grade counts:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
