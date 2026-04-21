import React, { useState, useEffect, useRef } from "react";
import { X, Save, FileEdit, User, BookOpen, AlertCircle } from "lucide-react";
import { renderMathInElement } from "mathlive";
import { gradeSubmission } from "../services/StudyHistoryService";
import "./EssayGradingModal.css";

const EssayGradingModal = ({ isOpen, onClose, data, loading, onSuccess }) => {
    const modalBodyRef = useRef(null);
    const [overallEssayPoints, setOverallEssayPoints] = useState(0);
    const [overallFeedback, setOverallFeedback] = useState("");
    const [isSaving, setIsSaving] = useState(false);

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

    // Khởi tạo state
    useEffect(() => {
        if (data) {
            setOverallFeedback(data.teacherFeedback || "");
            
            // Tính điểm hiện tại được gán cho các câu hỏi tự luận
            let totalEssayP = 0;
            data.answers?.forEach((ans) => {
                if (ans.questionId && ans.questionId.type === "essay") {
                    totalEssayP += Number(ans.points) || 0;
                }
            });
            setOverallEssayPoints(totalEssayP);
        } else {
            setOverallEssayPoints(0);
            setOverallFeedback("");
        }
    }, [data]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="essay-grade-backdrop">
                <div className="essay-grade-modal">
                    <div className="essay-grade-header">
                        <h2>Chấm điểm Tự luận</h2>
                        <button className="essay-grade-close" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="essay-grade-body loading-state">
                        <p>Đang tải dữ liệu bài làm...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const studentName = data.user?.name || data.userName || "Khách";
    const lessonTitle = data.lesson?.title || data.lessonTitle || "Không xác định";
    const essayAnswers = data.answers?.filter(ans => ans.questionId && ans.questionId.type === "essay") || [];

    const handleSave = async () => {
        const gradedAnswers = essayAnswers.map((ans, index) => ({
            questionId: ans.questionId._id,
            // Gán tổng điểm cho câu hỏi tự luận đầu tiên
            points: index === 0 ? Number(overallEssayPoints) || 0 : 0,
            feedback: "" 
        }));

        setIsSaving(true);
        try {
            const result = await gradeSubmission(data._id, {
                gradedAnswers,
                teacherFeedback: overallFeedback
            });
            if (result.success) {
                alert("Đã lưu điểm thành công!");
                onSuccess && onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
            alert("Đã xảy ra lỗi khi lưu thông tin chấm điểm.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="essay-grade-backdrop" onClick={(e) => e.target.className === "essay-grade-backdrop" && onClose()}>
            <div className="essay-grade-modal">
                <div className="essay-grade-header">
                    <div className="header-title">
                        <FileEdit size={22} className="header-icon" />
                        <h2>Chấm điểm Bài tự luận</h2>
                    </div>
                    <button className="essay-grade-close" onClick={onClose} title="Đóng">
                        <X size={20} />
                    </button>
                </div>

                <div className="essay-grade-body" ref={modalBodyRef}>
                    <div className="eg-info-bar">
                        <div className="eg-info-item">
                            <User size={18} className="eg-info-icon" />
                            <span>Học sinh:</span>
                            <strong>{studentName}</strong>
                        </div>
                        <div className="eg-info-item">
                            <BookOpen size={18} className="eg-info-icon" />
                            <span>Bài làm:</span>
                            <strong>{lessonTitle}</strong>
                        </div>
                    </div>

                    {essayAnswers.length === 0 ? (
                        <div className="eg-no-data">
                            <AlertCircle size={32} color="#9ca3af" />
                            <p>Không có câu hỏi tự luận nào trong bài thi này để chấm.</p>
                        </div>
                    ) : (
                        <div className="eg-questions-list">
                            {essayAnswers.map((ansItem, idx) => {
                                const question = ansItem.questionId;
                                const qId = question._id;

                                return (
                                    <div key={qId} className="eg-question-card">
                                        <div className="eg-question-badge">Câu {idx + 1}</div>
                                        
                                        <div className="eg-content-box eg-question-text">
                                            {question.question || "Nội dung câu hỏi bị thiếu."}
                                        </div>

                                        <div className="eg-answer-comparison">
                                            <div className="eg-student-side">
                                                <h4>Bài làm của học sinh</h4>
                                                <div className="eg-text-box student-answer">
                                                    {ansItem.answer || <span className="empty-text">Chưa trả lời</span>}
                                                </div>
                                            </div>
                                            <div className="eg-reference-side">
                                                <h4>Đáp án gợi ý</h4>
                                                <div className="eg-text-box reference-answer">
                                                    {question.explanation || <span className="empty-text">Không có gợi ý</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {essayAnswers.length > 0 && (
                        <div className="eg-overall-feedback">
                            <h3>Chấm điểm và Nhận xét</h3>
                            
                            <div className="eg-overall-points-container" style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>
                                    Tổng điểm cho phần tự luận:
                                </label>
                                <input 
                                    type="number" 
                                    min="0" 
                                    step="0.25"
                                    className="eg-points-input"
                                    style={{ width: "150px" }}
                                    value={overallEssayPoints}
                                    onChange={(e) => setOverallEssayPoints(e.target.value)}
                                />
                            </div>

                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>
                                Lời phê của giáo viên (tổng thể):
                            </label>
                            <textarea 
                                rows="3"
                                placeholder="Viết nhận xét tổng thể cho học sinh..."
                                className="eg-overall-textarea"
                                value={overallFeedback}
                                onChange={(e) => setOverallFeedback(e.target.value)}
                            ></textarea>
                        </div>
                    )}
                </div>

                <div className="essay-grade-footer">
                    <button className="eg-btn eg-btn-cancel" onClick={onClose} disabled={isSaving}>Hủy thao tác</button>
                    {essayAnswers.length > 0 && (
                        <button className="eg-btn eg-btn-save" onClick={handleSave} disabled={isSaving}>
                            <Save size={18} />
                            {isSaving ? "Đang lưu..." : "Lưu điểm & Nhận xét"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EssayGradingModal;
