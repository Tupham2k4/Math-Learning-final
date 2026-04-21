import React, { useEffect, useRef } from "react";
import { X, BookOpen, User, CheckCircle2, XCircle, Award, CalendarClock, MessageSquare } from "lucide-react";
import { renderMathInElement } from "mathlive";
import "./SubmissionDetailModal.css";

const SubmissionDetailModal = ({ isOpen, onClose, data, loading }) => {
    const modalBodyRef = useRef(null);

    // Render MathLive
    useEffect(() => {
        if (isOpen && modalBodyRef.current && !loading && data) {
            renderMathInElement(modalBodyRef.current, {
                TeX: {
                    delimiters: {
                        inline: [['$', '$'], ['\\(', '\\)']],
                        display: [['$$', '$$'], ['\\[', '\\]']]
                    }
                }
            });
        }
    }, [isOpen, data, loading]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="sub-detail-backdrop">
                <div className="sub-detail-modal">
                    <div className="sub-detail-header">
                        <h2>Chi tiết Bài làm</h2>
                        <button className="sub-detail-close" onClick={onClose} title="Đóng">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="sub-detail-body" style={{ textAlign: "center", padding: "40px" }}>
                        <p>Đang tải dữ liệu chi tiết...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const studentName = data.user?.name || data.userName || "Khách";
    const lessonTitle = data.lesson?.title || data.lessonTitle || "Không xác định";
    const statusLabel = data.status === "graded" ? "Đã chấm xong" : "Chưa chấm xong";
    const statusClass = data.status === "graded" ? "status-badge-graded" : "status-badge-pending";
    const score = data.score !== undefined ? Number(data.score).toFixed(2) : "-";

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    };

    const optionLabels = ["A", "B", "C", "D", "E", "F"];

    const getAnswerLabel = (answerValue, options) => {
        if (!options || options.length === 0) return answerValue;
        
        const optionIndex = Number(answerValue);
        if (!isNaN(optionIndex) && optionIndex >= 0 && optionIndex < options.length) {
            return optionLabels[optionIndex];
        }
        
        // Nếu là string text value thì quy ngược lại index
        const foundIndex = options.findIndex(opt => String(opt) === String(answerValue));
        if (foundIndex !== -1) return optionLabels[foundIndex];
        
        return answerValue; // fallback
    };

    return (
        <div className="sub-detail-backdrop" onClick={(e) => e.target.className === "sub-detail-backdrop" && onClose()}>
            <div className="sub-detail-modal">
                <div className="sub-detail-header">
                    <h2>Chi tiết Bài làm</h2>
                    <button className="sub-detail-close" onClick={onClose} title="Đóng">
                        <X size={20} />
                    </button>
                </div>

                <div className="sub-detail-body" ref={modalBodyRef}>
                    {/* Header Info */}
                    <div className="sub-info-bar">
                        <div className="info-col">
                            <div className="info-item">
                                <User size={18} className="info-icon" />
                                <div>
                                    <span className="info-label">Học sinh</span>
                                    <span className="info-value text-blue">{studentName}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <CalendarClock size={18} className="info-icon" />
                                <div>
                                    <span className="info-label">Ngày nộp</span>
                                    <span className="info-value">{formatDate(data.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-col">
                            <div className="info-item">
                                <BookOpen size={18} className="info-icon" />
                                <div>
                                    <span className="info-label">Tên bài học / Bài thi</span>
                                    <span className="info-value">{lessonTitle}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <Award size={18} className="info-icon text-red" />
                                <div>
                                    <span className="info-label">Tổng điểm</span>
                                    <span className="info-value text-red" style={{ fontSize: "16px", fontWeight: "bold" }}>
                                        {score} 
                                        <span className={`sub-status-badge ${statusClass}`} style={{ marginLeft: "10px" }}>
                                            {statusLabel}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Feedback (Global) */}
                    {data.teacherFeedback && (
                        <div className="sub-teacher-feedback">
                            <strong><MessageSquare size={16} /> Nhận xét chung:</strong>
                            <p>{data.teacherFeedback}</p>
                        </div>
                    )}

                    <div className="sub-answers-list">
                        <h3 className="section-title">Danh sách bài giải</h3>
                        
                        {data.answers && data.answers.map((ansItem, idx) => {
                            const question = ansItem.questionId || {};
                            const isMcq = question.type === "mcq";
                            const isEssay = question.type === "essay";
                            const studentAnswer = ansItem.answer || "";
                            
                            // Trắc nghiệm kiểm tra đúng sai và trích xuất index để map sang giao diện an toàn
                            let isCorrect = false;
                            let userIndex = -1;
                            let correctIndex = -1;

                            if (isMcq) {
                                const saStr = String(studentAnswer).trim().toLowerCase();
                                const caStr = String(question.correctAnswer || "").trim().toLowerCase();
                                const optionsList = question.options || [];

                                // Tìm index thực sự của đáp án đúng (Backend cho phép lưu Text, chữ cái A,B,C,D hoặc Index)
                                if (optionsList.length > 0) {
                                    const textMatchIdx = optionsList.findIndex(op => String(op).trim().toLowerCase() === caStr);
                                    if (textMatchIdx !== -1) {
                                        correctIndex = textMatchIdx;
                                    } else {
                                        const letterMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5 };
                                        if (letterMap.hasOwnProperty(caStr)) {
                                            correctIndex = letterMap[caStr];
                                        } else {
                                            const parsedCa = parseInt(caStr, 10);
                                            if (!isNaN(parsedCa) && parsedCa >= 0 && parsedCa < optionsList.length && String(parsedCa) === caStr) {
                                                correctIndex = parsedCa;
                                            }
                                        }
                                    }
                                }

                                // Front-end QuizPage luôn gửi studentAnswer dưới dạng index (VD: "0", "1")
                                userIndex = parseInt(saStr, 10);
                                if (!isNaN(userIndex) && userIndex >= 0 && userIndex < optionsList.length) {
                                    isCorrect = (correctIndex !== -1 && userIndex === correctIndex);
                                } else {
                                    // Fallback nếu vì lý do nào đó studentAnswer là Text (từ version cũ)
                                    isCorrect = saStr === caStr;
                                    if (!isCorrect && correctIndex !== -1 && saStr !== "") {
                                        const saTextIdx = optionsList.findIndex(op => String(op).trim().toLowerCase() === saStr);
                                        if (saTextIdx !== -1) isCorrect = (saTextIdx === correctIndex);
                                    }
                                }
                            }

                            return (
                                <div key={ansItem._id || idx} className="question-result-card">
                                    <div className="qr-header">
                                        <span className={`qr-type ${isEssay ? "qr-type-essay" : "qr-type-mcq"}`}>
                                            Câu {idx + 1} - {isEssay ? "Tự luận" : "Trắc nghiệm"}
                                        </span>
                                        <span className="qr-points">Điểm: {ansItem.points !== undefined ? ansItem.points : 0}</span>
                                    </div>
                                    
                                    <div className="qr-question">
                                        {question.question || "Nội dung câu hỏi bị thiếu hoặc đã bị xóa."}
                                    </div>

                                    {/* Format MCQ */}
                                    {isMcq && question.options && question.options.length > 0 && (
                                        <div className="qr-mcq-section">
                                            <div className="qr-options">
                                                {question.options.map((opt, oIdx) => {
                                                    const letter = optionLabels[oIdx] || "?";
                                                    
                                                    // Kiểm tra lựa chọn của User và đáp án đúng bằng Index để tránh trùng lắp Text
                                                    let isUserChoice = false;
                                                    if (!isNaN(userIndex) && userIndex >= 0) {
                                                        isUserChoice = (oIdx === userIndex);
                                                    } else {
                                                        isUserChoice = String(opt).trim().toLowerCase() === String(studentAnswer).trim().toLowerCase();
                                                    }

                                                    let isCorrectChoice = false;
                                                    if (correctIndex !== -1) {
                                                        isCorrectChoice = (oIdx === correctIndex);
                                                    } else {
                                                        isCorrectChoice = String(opt).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
                                                    }
                                                    
                                                    let className = "qr-option-item";
                                                    if (isCorrectChoice) className += " correct";
                                                    else if (isUserChoice && !isCorrectChoice) className += " wrong";

                                                    return (
                                                        <div key={oIdx} className={className}>
                                                            <div className="qr-opt-letter">{letter}</div>
                                                            <div className="qr-opt-text">{opt}</div>
                                                            {isCorrectChoice && <CheckCircle2 size={16} className="icon-correct" />}
                                                            {isUserChoice && !isCorrectChoice && <XCircle size={16} className="icon-wrong" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className={`qr-result-banner ${isCorrect ? "success" : "danger"}`}>
                                                {isCorrect ? (
                                                    <><CheckCircle2 size={18} /> Học sinh đã làm đúng</>
                                                ) : (
                                                    <><XCircle size={18} /> Học sinh làm sai (đã chọn: {getAnswerLabel(studentAnswer, question.options)})</>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Format Essay */}
                                    {isEssay && (
                                        <div className="qr-essay-section">
                                            <div className="qr-student-answer">
                                                <h4>Bài làm của học sinh:</h4>
                                                <div className="qr-text-box student-text">
                                                    {studentAnswer || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>Không có câu trả lời</span>}
                                                </div>
                                            </div>
                                            
                                            {question.correctAnswer && (
                                                <div className="qr-correct-answer">
                                                    <h4>Đáp án / Yêu cầu chấm:</h4>
                                                    <div className="qr-text-box reference-text">
                                                        {question.correctAnswer}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Common Explanation */}
                                    {question.explanation && (
                                        <div className="qr-explanation">
                                            <h4>Giải thích chi tiết:</h4>
                                            <p>{question.explanation}</p>
                                        </div>
                                    )}
                                    
                                    {/* Question Feedback */}
                                    {ansItem.feedback && (
                                        <div className="qr-item-feedback">
                                            <h4>Lời phê của GV cho câu này:</h4>
                                            <p>{ansItem.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetailModal;
