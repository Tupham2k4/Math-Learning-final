import React, { useEffect, useRef } from 'react';
import { X, BookOpen, Layers, CheckCircle2, FileText, Info, Award } from 'lucide-react';
import { renderMathInElement } from 'mathlive';
import './ExerciseDetailModal.css';

const ExerciseDetailModal = ({ isOpen, onClose, exercise }) => {
    const modalBodyRef = useRef(null);

    // Hiệu ứng render công thức Toán học MathLive
    useEffect(() => {
        if (isOpen && modalBodyRef.current) {
            renderMathInElement(modalBodyRef.current, {
                TeX: {
                    delimiters: {
                        inline: [['$', '$'], ['\\(', '\\)']],
                        display: [['$$', '$$'], ['\\[', '\\]']]
                    }
                }
            });
        }
    }, [isOpen, exercise]);

    if (!isOpen || !exercise) return null;

    // Trích xuất thông tin động (Hỗ trợ Data thô hoặc đã Populate)
    const lessonName = exercise.lessonName || exercise.lessonId?.title || 'Chưa cập nhật';
    const rawGrade = exercise.grade || exercise.lessonId?.chapterId?.grade || '-';
    const gradeNum = String(rawGrade).replace(/\D/g, '') || '-';
    const chapterName = exercise.chapterName || exercise.lessonId?.chapterId?.title || 'Chưa cập nhật';
    
    // Xử lý loại câu hỏi
    const isMcq = exercise.type === 'mcq';
    const isEssay = exercise.type === 'essay';
    const typeLabel = isMcq ? 'Trắc nghiệm' : isEssay ? 'Tự luận' : 'Khác';
    const typeColorClass = isMcq ? 'type-mcq' : 'type-essay';

    // Xử lý Đáp án đúng cho Trắc nghiệm (A, B, C, D)
    const optionLabels = ['A', 'B', 'C', 'D'];
    const correctAnswerLabel = String(exercise.correctAnswer).toUpperCase();

    return (
        <div className="ex-detail-backdrop" onClick={(e) => e.target.className === 'ex-detail-backdrop' && onClose()}>
            <div className="ex-detail-modal">
                <div className="ex-detail-header">
                    <h2>Chi tiết Bài tập</h2>
                    <button className="ex-detail-close" onClick={onClose} title="Đóng">
                        <X size={20} />
                    </button>
                </div>

                <div className="ex-detail-body" ref={modalBodyRef}>
                    {/* Băng thông tin chung */}
                    <div className="ex-info-bar">
                        <div className="info-item">
                            <BookOpen size={18} className="info-icon" />
                            <div>
                                <span className="info-label">Tên bài học</span>
                                <span className="info-value">{lessonName}</span>
                            </div>
                        </div>
                        <div className="info-divider"></div>
                        <div className="info-item">
                            <Layers size={18} className="info-icon" />
                            <div>
                                <span className="info-label">Vị trí</span>
                                <span className="info-value">Khối {gradeNum} • {chapterName}</span>
                            </div>
                        </div>
                        <div className="info-divider"></div>
                        <div className="info-item">
                            <FileText size={18} className="info-icon" />
                            <div>
                                <span className="info-label">Dạng bài</span>
                                <span className={`info-badge ${typeColorClass}`}>{typeLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vùng Câu hỏi */}
                    <div className="ex-content-section">
                        <h3 className="section-title">Câu hỏi / Đề bài</h3>
                        <div className="question-box">
                            {exercise.question || 'Không có dữ liệu câu hỏi.'}
                        </div>
                    </div>

                    {/* Vùng Đáp án cho Trắc nghiệm */}
                    {isMcq && exercise.options && exercise.options.length > 0 && (
                        <>
                            <div className="ex-content-section">
                                <h3 className="section-title">Các lựa chọn</h3>
                                <div className="options-grid">
                                    {exercise.options.map((opt, idx) => {
                                        const letter = optionLabels[idx] || '?';
                                        const isCorrect = correctAnswerLabel === letter;
                                        
                                        return (
                                            <div key={idx} className={`option-card ${isCorrect ? 'is-correct' : ''}`}>
                                                <div className="opt-letter">{letter}</div>
                                                <div className="opt-text">{opt}</div>
                                                {isCorrect && (
                                                    <div className="opt-check" title="Đây là đáp án đúng">
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Hiện thêm dòng kết luận đáp án đúng cho Trắc nghiệm */}
                            <div className="ex-correct-answer-banner">
                                <Award size={20} className="reward-icon" />
                                <span>Đáp án chính xác: <strong>{correctAnswerLabel}</strong></span>
                            </div>
                        </>
                    )}

                    {/* Vùng Đáp án cho Tự luận */}
                    {isEssay && exercise.correctAnswer && (
                        <div className="ex-content-section">
                            <h3 className="section-title">Đáp án tham khảo / Giải thích</h3>
                            <div className="essay-answer-box">
                                {exercise.correctAnswer}
                            </div>
                        </div>
                    )}

                    {/* Vùng Giải thích dùng chung */}
                    {exercise.explanation && (
                        <div className="ex-content-section">
                            <h3 className="section-title">
                                <Info size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} />
                                Nhận xét / Giải thích chi tiết
                            </h3>
                            <div className="explanation-box">
                                {exercise.explanation}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetailModal;
