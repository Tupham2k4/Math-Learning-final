import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EssayDetailPage.css";
import "./MathEditors.css";
import EssayHeader from "./EssayHeader";
import MathToolbar from "./MathToolbar";
import EquationEditor from "./EquationEditor";
import GraphEditor from "./GraphEditor";
import GeometryEditor from "./GeometryEditor";
import "mathlive";
import MathMarkdown from "../../Common/MathMarkdown";
import { UserContext } from "../../../Context/UserContext";
// dữ liệu tự luận sẽ được fetch từ API

const EssayDetailPage = () => {
  const { gradeId, lessonId } = useParams();
  const { user } = useContext(UserContext);

  // Debug: log params to help trace missing lessonTitle
  const normalizedLessonId = lessonId
    ? decodeURIComponent(lessonId).trim()
    : lessonId;
  console.log("EssayDetailPage params:", {
    gradeId,
    lessonId,
    normalizedLessonId,
  });

  const storageKey = `essay_${lessonId}`;

  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState({ type: null, qId: null });
  const [lessonTitle, setLessonTitle] = useState("Đang tải tên bài học...");
  const [liveResult, setLiveResult] = useState(null);

  // Load tên bài học (từ API hoặc từ file local tĩnh)
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/lessons/${lessonId}`,
        );
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
  }, [lessonId, normalizedLessonId]);

  // Load list câu hỏi
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:4000/api/questions?lessonId=${lessonId}`,
        );
        const data = await res.json();
        if (data.success) {
          const essayQs = data.data.filter((q) => q.type === "essay");
          setQuestions(essayQs);
        }
      } catch (err) {
        console.error("Lỗi tải câu hỏi:", err);
      } finally {
        setLoading(false);
      }
    };
    if (lessonId) {
      fetchQuestions();
    }
  }, [lessonId]);

  // Load local storage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setIsSubmitted(parsed.submitted || false);
    }
  }, [storageKey]);

  // Fetch kết quả đã chấm từ Server (hoặc polling nếu đang pending)
  useEffect(() => {
    const effectiveUserId = user?._id || user?.id;
    if (!isSubmitted || !effectiveUserId || !lessonId) return;

    let cancelled = false;
    let intervalId = null;

    const fetchLatestResult = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/results/latest?userId=${encodeURIComponent(
            effectiveUserId,
          )}&lessonId=${encodeURIComponent(lessonId)}`,
        );

        if (res.status === 404) {
          localStorage.removeItem(storageKey);
          setIsSubmitted(false);
          setAnswers({});
          setLiveResult(null);
          setToastMessage("Bài làm của bạn đã bị xóa bởi giáo viên. Vui lòng làm lại từ đầu.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);

          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          return;
        }

        const data = await res.json();
        if (cancelled || !res.ok || !data?.success || !data?.result) return;

        setLiveResult(data.result);

        if (data.result.status === "graded" && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (error) {
        // keep UI stable if polling fails
      }
    };

    fetchLatestResult();
    intervalId = setInterval(fetchLatestResult, 5000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSubmitted, lessonId, user]);

  // Lưu dữ liệu vào localStorage
  const saveToLocal = (newAnswers, submitted = isSubmitted) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        submitted,
        answers: newAnswers,
      }),
    );
  };

  // Autosave khi nhập
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => {
      const current = prev[questionId] || {
        text: "",
        graphs: [],
        geometries: [],
      };
      const normalized =
        typeof current === "string"
          ? { text: current, graphs: [], geometries: [] }
          : current;

      let updatedValue;
      if (typeof value === "string") {
        updatedValue = { ...normalized, text: value };
      } else {
        updatedValue = { ...normalized, ...value };
      }

      const updated = { ...prev, [questionId]: updatedValue };
      saveToLocal(updated);
      return updated;
    });
  };

  const handleInsertSymbol = (qId, latex) => {
    const container = document.querySelector(`[data-q-id="${qId}"]`);
    const mf = container ? container.querySelector("math-field") : null;
    if (mf) {
      mf.focus();
      mf.insert(latex);
    }
  };

  const openModal = (type, qId) => {
    setActiveModal({ type, qId });
  };

  const closeModal = () => {
    setActiveModal({ type: null, qId: null });
  };

  const handleSaveDrawing = (data) => {
    const { qId, type } = activeModal;
    const current = answers[qId] || { text: "", graphs: [], geometries: [] };
    const normalized =
      typeof current === "string"
        ? { text: current, graphs: [], geometries: [] }
        : current;

    const listKey = type === "graph" ? "graphs" : "geometries";
    const newList = [...(normalized[listKey] || []), data];

    handleAnswerChange(qId, { [listKey]: newList });
    closeModal();
  };

  const removeDrawing = (qId, type, index) => {
    const current = answers[qId];
    if (!current) return;
    const normalized =
      typeof current === "string"
        ? { text: current, graphs: [], geometries: [] }
        : current;

    const listKey = type === "graph" ? "graphs" : "geometries";
    const newList = normalized[listKey].filter((_, i) => i !== index);

    handleAnswerChange(qId, { [listKey]: newList });
  };

  // Chặn thoát trang
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSubmitted]);

  // Nút hoàn thành bài làm
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const formattedAnswers = questions.map((q) => {
        const qId = q._id || q.id;
        const rawAnswer = answers[qId];
        const answerText =
          typeof rawAnswer === "object"
            ? rawAnswer?.text || ""
            : (rawAnswer ?? "");

        return {
          questionId: qId,
          answer: String(answerText),
        };
      });

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
      if (!res.ok) {
        throw new Error(data.message || "Nộp bài thất bại");
      }

      setIsSubmitted(true);
      saveToLocal(answers, true);
      setToastMessage(
        data.status === "pending"
          ? "Đã nộp bài. Bài tự luận đang chờ giáo viên chấm."
          : "Đã nộp bài thành công.",
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err.message || "Lỗi kết nối server");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    saveToLocal(answers, false);
  };

  // Hiện đáp án
  const toggleSolution = (id) => {
    setShowSolution((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      <EssayHeader
        grade={gradeId}
        subtitle="Tự luận"
        lessonTitle={lessonTitle}
      />

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Đang tải câu hỏi tự luận...
        </div>
      ) : (
        <div className="essay-container">
          {/* Tổng điểm và nhận xét chung của giáo viên */}
          {liveResult?.status === "graded" && (
            <div
              style={{
                backgroundColor: "#eef6ff",
                border: "1px solid #cfe5ff",
                color: "#1d3b5c",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#198754", marginBottom: liveResult?.teacherFeedback ? "10px" : "0" }}>
                Tổng điểm: {liveResult.score} điểm
              </div>
              {liveResult?.teacherFeedback && (
                <div style={{ fontSize: "15px" }}>
                  <strong>Nhận xét chung:</strong> {liveResult.teacherFeedback}
                </div>
              )}
            </div>
          )}
          {/* Thanh tiến trình */}
          <div className="progress-section">
            <div className="progress-text">
              Câu {questions.length > 0 ? Object.keys(answers).length : 0}/
              {questions.length}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          {questions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              Chưa có câu hỏi tự luận cho bài học này.
            </div>
          ) : (
            questions.map((q, index) => {
              const qId = q._id || q.id;
              return (
                <div key={qId} className="essay-card">
                  {/* Header / Câu hỏi giữ nguyên */}
                  <h3>Câu {index + 1}</h3>
                  <div className="question">
                    <MathMarkdown content={q.question} />
                  </div>

                  {/* Công cụ nhập nâng cấp */}
                  {!isSubmitted && (
                    <>
                      <MathToolbar
                        onInsert={(latex) => handleInsertSymbol(qId, latex)}
                      />
                      <div data-q-id={qId}>
                        <EquationEditor
                          value={
                            (typeof answers[qId] === "object"
                              ? answers[qId].text
                              : answers[qId]) || ""
                          }
                          onChange={(val) => handleAnswerChange(qId, val)}
                        />
                      </div>
                      <div className="editor-actions">
                        <button
                          className="action-btn"
                          onClick={() => openModal("graph", qId)}
                        >
                          📊 Vẽ đồ thị
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => openModal("geometry", qId)}
                        >
                          📐 Vẽ hình
                        </button>
                      </div>
                    </>
                  )}

                  {/* Hiển thị kết quả khi đã submit (chế độ readonly) */}
                  {isSubmitted && (
                    <div className="readonly-answer">
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
                          : answers[qId]) || ""}
                      </math-field>
                    </div>
                  )}

                  {/* Hiển thị các hình đã vẽ */}
                  <div className="drawings-preview">
                    {typeof answers[qId] === "object" && (
                      <>
                        {answers[qId].graphs?.map((g, i) => (
                          <div key={`graph-${i}`} className="drawing-item">
                            <img src={g.image} alt={`Graph ${i}`} />
                            {!isSubmitted && (
                              <button
                                className="remove-drawing"
                                onClick={() => removeDrawing(qId, "graph", i)}
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                        {answers[qId].geometries?.map((g, i) => (
                          <div key={`geom-${i}`} className="drawing-item">
                            <img src={g.image} alt={`Geometry ${i}`} />
                            {!isSubmitted && (
                              <button
                                className="remove-drawing"
                                onClick={() =>
                                  removeDrawing(qId, "geometry", i)
                                }
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {isSubmitted && (() => {
                    const dbAnswer = liveResult?.answers?.find(
                      (a) => String(a.questionId?._id || a.questionId) === String(qId)
                    );
                    if (dbAnswer && dbAnswer.feedback) {
                      return (
                        <div style={{ marginTop: "15px", padding: "10px 12px", backgroundColor: "#eef6ff", borderLeft: "4px solid #0d6efd", borderRadius: "4px" }}>
                          <span style={{ color: "#333", fontWeight: "bold" }}>Giáo viên nhận xét:</span> {dbAnswer.feedback}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {isSubmitted && (
                    <div className="submitted-actions">
                      <button
                        className="solution-btn"
                        onClick={() => toggleSolution(qId)}
                      >
                        Xem đáp án chi tiết
                      </button>
                      <button className="edit-back-btn" onClick={handleEdit}>
                        Sửa lại bài làm
                      </button>

                      {showSolution[qId] && (
                        <div className="solution-box">
                          {q.explanation ? (
                            <MathMarkdown content={q.explanation} />
                          ) : (
                            <p>Không có đáp án chi tiết.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {!isSubmitted && questions.length > 0 && (
            <div className="button-container">
              <button className="save-btn" onClick={() => setShowToast(true)}>
                Lưu nháp
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          )}

          {showToast && (
            <div className="toast">
              {toastMessage ||
                "Bài làm đã được lưu. Bạn có thể xem đáp án chi tiết."}
            </div>
          )}
        </div>
      )}

      {/* Modals cho đồ thị và hình học */}
      <GraphEditor
        isOpen={activeModal.type === "graph"}
        onClose={closeModal}
        onSave={handleSaveDrawing}
      />
      <GeometryEditor
        isOpen={activeModal.type === "geometry"}
        onClose={closeModal}
        onSave={handleSaveDrawing}
      />
    </div>
  );
};

export default EssayDetailPage;
