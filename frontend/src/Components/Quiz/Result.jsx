import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";
import Question from "./Question";
import "mathlive";
import MathRenderer from "../Chatbot/MathRenderer/MathRenderer";

// --- Helper Functions ---

const getComment = (percentage) => {
  if (percentage >= 80) return "Xuất sắc! Bạn đã làm rất tốt.";
  if (percentage >= 60) return "Khá tốt! Hãy cố gắng hơn nữa.";
  if (percentage >= 40) return "Cần cải thiện. Hãy ôn tập lại.";
  return "Bạn cần ôn tập nhiều hơn.";
};

const getAnswerIndices = (question, qResult) => {
  let cAnswerIndex = undefined;
  let uAnswerIndex = undefined;

  if (!qResult) return { cAnswerIndex, uAnswerIndex };

  const { correctAnswer: ca, userAnswer: ua } = qResult;
  const options = question.options;
  const hasOptions = Array.isArray(options);
  const normalize = (val) => String(val).trim().toLowerCase();

  // Correct Answer Index
  if (hasOptions && ca !== undefined && ca !== null) {
    const idx = options.findIndex((opt) => normalize(opt) === normalize(ca));
    cAnswerIndex =
      idx !== -1 ? idx : !isNaN(Number(ca)) ? Number(ca) : undefined;
      
    // Hỗ trợ admin nhập A, B, C, D
    if (cAnswerIndex === undefined) {
      const letterMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
      if (letterMap.hasOwnProperty(normalize(ca))) {
        cAnswerIndex = letterMap[normalize(ca)];
      }
    }
  } else if (!isNaN(Number(ca))) {
    cAnswerIndex = Number(ca);
  }

  // User Answer Index
  if (hasOptions && ua !== undefined && ua !== null) {
    const idx = options.findIndex((opt) => normalize(opt) === normalize(ua));
    uAnswerIndex =
      idx !== -1 ? idx : !isNaN(Number(ua)) ? Number(ua) : undefined;
  } else if (!isNaN(Number(ua))) {
    uAnswerIndex = Number(ua);
  }

  return { cAnswerIndex, uAnswerIndex };
};

const formatOptionLabel = (
  index,
  optionsLength,
  fallbackValue,
  defaultText,
) => {
  if (typeof index === "number" && index >= 0 && index < (optionsLength || 0)) {
    return String.fromCharCode(65 + index); // Converts 0->A, 1->B, etc.
  }
  if (fallbackValue !== null && fallbackValue !== undefined) {
    return fallbackValue;
  }
  return defaultText;
};

// --- Sub Components ---

const ReviewItem = ({ question, index, qResult, dbAnswer, answers }) => {
  const qId = question._id || question.id;
  const { cAnswerIndex, uAnswerIndex } = getAnswerIndices(question, qResult);

  const showSelected =
    typeof uAnswerIndex === "number" ? uAnswerIndex : answers[qId];
  const showCorrect =
    typeof cAnswerIndex === "number" ? cAnswerIndex : question.correctAnswer;
  const isEssay = question.type === "essay";

  return (
    <div key={qId} className="result-question-wrapper">
      <Question
        questionIndex={index}
        question={question.question}
        options={question.options || []}
        selectedAnswer={showSelected}
        onAnswerSelect={() => {}}
        correctAnswer={showCorrect}
        showResult={true}
      />
      {isEssay ? (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "10px",
            border: "1px solid #e9ecef",
          }}
        >
          <div style={{ marginBottom: "12px", color: "#333" }}>
            <strong style={{ display: "block", marginBottom: "8px" }}>
              Bài làm của bạn:
            </strong>
            <div
              style={{
                padding: "12px",
                background: "#fff",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                minHeight: "60px",
                whiteSpace: "pre-wrap",
              }}
            >
              {dbAnswer?.answer || answers[qId] ? (
                <math-field
                  read-only
                  style={{
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "1.2rem",
                    display: "block",
                  }}
                >
                  {(typeof answers[qId] === "object"
                    ? answers[qId].text
                    : dbAnswer?.answer || answers[qId]) || ""}
                </math-field>
              ) : (
                <span style={{ color: "#adb5bd", fontStyle: "italic" }}>
                  Không có nội dung
                </span>
              )}
            </div>
          </div>
          {dbAnswer?.feedback && (
            <div
              style={{
                marginTop: "8px",
                padding: "10px 12px",
                backgroundColor: "#eef6ff",
                borderLeft: "4px solid #0d6efd",
                borderRadius: "4px",
              }}
            >
              <span style={{ color: "#333", fontWeight: "bold" }}>
                Giáo viên nhận xét:
              </span>{" "}
              <MathRenderer content={dbAnswer.feedback} />
            </div>
          )}
        </div>
      ) : (
        qResult && (
          <div
            className={`answer-status ${qResult.isCorrect ? "correct-status" : "incorrect-status"}`}
            style={{
              backgroundColor: qResult.isCorrect ? "#d4edda" : "#f8d7da",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
              border: `1px solid ${qResult.isCorrect ? "#c3e6cb" : "#f5c6cb"}`,
            }}
          >
            <div style={{ marginBottom: "8px", color: "#333", display: "flex", alignItems: "center" }}>
              <strong style={{ marginRight: "8px" }}>Đáp án của bạn:</strong>{" "}
              {formatOptionLabel(
                uAnswerIndex,
                question.options?.length,
                qResult.userAnswer,
                "Không chọn",
              )}
            </div>
            <div style={{ marginBottom: "8px", color: "#333", display: "flex", alignItems: "center" }}>
              <strong style={{ marginRight: "8px" }}>Đáp án đúng:</strong>{" "}
              {formatOptionLabel(
                cAnswerIndex,
                question.options?.length,
                qResult.correctAnswer,
                "Không xác định",
              )}
            </div>
            <div style={{ fontWeight: "bold" }}>
              {qResult.isCorrect ? "Đúng" : "Sai"}
            </div>
          </div>
        )
      )}
    </div>
  );
};

// --- Main Component ---

const Result = ({
  score,
  totalQuestions,
  answers,
  quizData,
  gradeId,
  lessonId,
  userId,
  serverResult,
}) => {
  const navigate = useNavigate();
  const [liveResult, setLiveResult] = useState(serverResult || null);

  useEffect(() => {
    setLiveResult(serverResult || null);
  }, [serverResult]);

  useEffect(() => {
    const effectiveUserId = userId || liveResult?.userId;
    if (!effectiveUserId || !lessonId) return;

    let cancelled = false;
    let intervalId = null;

    const fetchLatestResult = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/results/latest?userId=${encodeURIComponent(
            effectiveUserId,
          )}&lessonId=${encodeURIComponent(lessonId)}&type=mcq`,
        );
        const data = await res.json();
        if (cancelled || !res.ok || !data?.success || !data?.result) return;

        setLiveResult((prev) => ({
          ...(prev || {}),
          ...data.result,
        }));

        if (data.result.status === "graded" && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (error) {
        // keep UI stable if polling fails temporarily
      }
    };

    fetchLatestResult();
    intervalId = setInterval(fetchLatestResult, 5000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [lessonId, userId, liveResult?.userId]);

  // Extract variables safely
  const resultStatus = liveResult?.status || "graded";
  const teacherFeedback = liveResult?.teacherFeedback;
  const finalScore = liveResult?.score ?? score;

  const correctCount = Array.isArray(liveResult?.results)
    ? liveResult.results.filter((item) => item?.isCorrect).length
    : 0;

  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const formattedScore = Number(finalScore || 0).toFixed(3);
  const comment = getComment(percentage);

  return (
    <div className="result-container">
      <h2>Kết quả bài thi</h2>

      {/* --- Score Summary --- */}
      {resultStatus === "pending" && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffe69c",
            color: "#7a4f01",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "12px",
            fontWeight: 600,
          }}
        >
          Bài làm đang đợi giáo viên chấm phần tự luận. Tổng điểm hiện tại chỉ
          chứa phần trắc nghiệm.
        </div>
      )}

      <p className="result-score">
        Số câu đúng: {correctCount}/{totalQuestions}
      </p>
      <p className="result-score">
        {resultStatus === "pending" ? "Tổng điểm tạm thời:" : "Tổng điểm:"}{" "}
        {formattedScore} điểm
      </p>
      <p className="result-comment">{comment}</p>

      {/* --- Teacher Feedback --- */}
      {teacherFeedback && (
        <div
          style={{
            backgroundColor: "#eef6ff",
            border: "1px solid #cfe5ff",
            color: "#1d3b5c",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "16px",
          }}
        >
          <strong>Nhận xét từ giáo viên:</strong>
          <MathRenderer content={teacherFeedback} />
        </div>
      )}

      {/* --- Detailed Answers --- */}
      <div className="review-container">
        <h3>Đáp án chi tiết:</h3>
        {quizData.map((question, index) => {
          const qId = question._id || question.id;
          const qResult = liveResult?.results?.find(
            (r) => String(r.questionId) === String(qId),
          );
          const dbAnswer = liveResult?.answers?.find(
            (a) => String(a.questionId?._id || a.questionId) === String(qId),
          );

          return (
            <ReviewItem
              key={qId}
              question={question}
              index={index}
              qResult={qResult}
              dbAnswer={dbAnswer}
              answers={answers}
            />
          );
        })}
      </div>

      <button
        className="back-button"
        onClick={() => navigate(`/bai-tap/lop/${gradeId}`)}
      >
        Quay lại bài làm
      </button>
    </div>
  );
};

export default Result;
