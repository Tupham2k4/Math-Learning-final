import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import Question from "./Question";
import Result from "./Result";
import QuizHeader from "./QuizHeader/QuizHeader";
import "./Quiz.css";

const QuizPage = () => {
  const { gradeId, lessonId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { user } = useContext(UserContext);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [lessonTitle, setLessonTitle] = useState("Đang tải tên bài học...");

  // Lấy danh sách câu hỏi từ API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:4000/api/questions?lessonId=${lessonId}`,
        );
        const data = await res.json();
        if (data.success) {
          const mcqQuestions = data.data.filter((q) => q.type === "mcq");
          setQuestions(mcqQuestions);
          setQuestions(mcqQuestions);
        }
      } catch (error) {
        console.error("Lỗi khi tải câu hỏi:", error);
      } finally {
        setLoading(false);
      }
    };
    if (lessonId) {
      fetchQuestions();
    }
  }, [lessonId]);

  // Lấy tên bài học (từ API, hoặc fallback sang local data)
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/lessons/${lessonId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setLessonTitle(data.data.title);
        } else {
          setLessonTitle("Bài học không tìm thấy");
        }
      } catch (err) {
        setLessonTitle("Bài học không tìm thấy");
      }
    };

    if (lessonId) {
      fetchTitle();
    }
  }, [lessonId]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && !submitting) {
      handleSubmit();
    }
  }, [timeLeft, showResult, loading]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    // Convert object to array of { questionId, answer }
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:4000/api/results/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token") || "",
        },
        body: JSON.stringify({
          userId: user?._id || user?.id || null,
          lessonId,
          answers: formattedAnswers,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.data || data); // Store response directly or wrapped in data
        setShowResult(true);
      } else {
        alert(data.message || "Lỗi khi nộp bài");
      }
    } catch (err) {
      console.error("Lỗi submit:", err);
      alert("Lỗi kết nối server");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Đang tải câu hỏi...
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <Result
        score={result?.score || 0}
        totalQuestions={questions.length}
        answers={answers}
        quizData={questions}
        gradeId={gradeId}
        lessonId={lessonId}
        userId={user?._id || user?.id}
        serverResult={result}
      />
    );
  }

  return (
    <div className="quiz-container">
      <QuizHeader
        grade={gradeId}
        subtitle="Trắc nghiệm"
        lessonTitle={lessonTitle}
        timeLeft={timeLeft}
        formatTime={formatTime}
      />
      <div className="questions-container">
        {questions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Chưa có câu hỏi cho bài học này.
          </div>
        ) : (
          questions.map((q, index) => (
            <Question
              key={q._id || q.id}
              questionIndex={index}
              question={q.question}
              options={q.options || []}
              selectedAnswer={answers[q._id || q.id]}
              onAnswerSelect={(qIdx, optionIndex) => handleAnswerChange(q._id || q.id, optionIndex)}
              correctAnswer={q.correctAnswer}
              showResult={false}
            />
          ))
        )}
      </div>
      {questions.length > 0 && (
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length || submitting}
        >
          {submitting ? "Đang nộp bài..." : "Nộp bài và kết thúc"}
        </button>
      )}
    </div>
  );
};

export default QuizPage;
