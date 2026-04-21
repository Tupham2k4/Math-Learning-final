import React, { useState, useEffect } from 'react';
import { X, BookOpen, Layers, FileText, CheckCircle2, Save, Loader2 } from 'lucide-react';
import './EditExerciseModal.css';

const EditExerciseModal = ({ isOpen, onClose, selectedLesson, selectedExercise, onSubmit }) => {
    // Tự động nhận diện selectedLesson hoặc selectedExercise
    const exercise = selectedExercise || selectedLesson;
    
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && exercise) {
            setFormData({
                question: exercise.question || '',
                options: exercise.options?.length === 4 ? [...exercise.options] : ['', '', '', ''],
                correctAnswer: exercise.correctAnswer || '',
                explanation: exercise.explanation || ''
            });
        }
    }, [isOpen, exercise]);

    if (!isOpen || !exercise) return null;

    const lessonName = exercise.lessonName || exercise.lessonId?.title || 'Chưa cập nhật';
    const rawGrade = exercise.grade || exercise.lessonId?.chapterId?.grade || '-';
    const gradeNum = String(rawGrade).replace(/\D/g, '') || '-';
    const chapterName = exercise.chapterName || exercise.lessonId?.chapterId?.title || 'Chưa cập nhật';
    
    const isMcq = exercise.type === 'mcq';
    const isEssay = exercise.type === 'essay';
    const typeLabel = isMcq ? 'Trắc nghiệm' : isEssay ? 'Tự luận' : 'Khác';
    const typeColorClass = isMcq ? 'type-mcq' : 'type-essay';

    const optionLabels = ['A', 'B', 'C', 'D'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const submitData = {
                question: formData.question,
                correctAnswer: formData.correctAnswer.toUpperCase(), // chuẩn hóa A/B/C/D
                explanation: formData.explanation
            };
            
            if (isMcq) {
                submitData.options = formData.options;
            } else if (isEssay) {
                submitData.correctAnswer = formData.correctAnswer;
                submitData.options = [];
            }
            
            await onSubmit(exercise._id, submitData);
        } catch (error) {
            console.error("Submit error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="edit-ex-backdrop">
            <div className="edit-ex-modal">
                <div className="edit-ex-header">
                    <h2>Chỉnh sửa bài tập</h2>
                    <button className="edit-ex-close" onClick={onClose} disabled={isSubmitting}>
                        <X size={20} />
                    </button>
                </div>

                <div className="edit-ex-body">
                    {/* Băng thông tin chung */}
                    <div className="edit-ex-info-bar">
                        <div className="edit-info-item">
                            <BookOpen size={18} className="edit-info-icon" />
                            <div>
                                <span className="edit-info-label">Tên bài học</span>
                                <span className="edit-info-value">{lessonName}</span>
                            </div>
                        </div>
                        <div className="edit-info-divider"></div>
                        <div className="edit-info-item">
                            <Layers size={18} className="edit-info-icon" />
                            <div>
                                <span className="edit-info-label">Vị trí</span>
                                <span className="edit-info-value">Khối {gradeNum} • {chapterName}</span>
                            </div>
                        </div>
                        <div className="edit-info-divider"></div>
                        <div className="edit-info-item">
                            <FileText size={18} className="edit-info-icon" />
                            <div>
                                <span className="edit-info-label">Dạng bài</span>
                                <span className={`edit-info-badge ${typeColorClass}`}>{typeLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* Câu hỏi */}
                    <div>
                        <h3 className="edit-section-title">Câu hỏi / Đề bài</h3>
                        <textarea 
                            className="edit-ex-input"
                            name="question"
                            rows="4"
                            value={formData.question}
                            onChange={handleChange}
                            placeholder="Nhập nội dung đề bài..."
                        />
                    </div>

                    {/* Vùng Đáp án cho Trắc nghiệm */}
                    {isMcq && (
                        <>
                            <div>
                                <h3 className="edit-section-title">Các lựa chọn</h3>
                                <div className="edit-ex-options-grid">
                                    {formData.options.map((opt, idx) => {
                                        const letter = optionLabels[idx];
                                        return (
                                            <div key={idx} className="edit-ex-option-card">
                                                <div className="edit-opt-letter">{letter}</div>
                                                <input 
                                                    className="edit-opt-input"
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                    placeholder={`Nhập đáp án ${letter}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="edit-section-title">Đáp án chính xác</h3>
                                <div className="edit-correct-ans-selectors">
                                    {optionLabels.map(letter => (
                                        <button 
                                            key={letter}
                                            type="button"
                                            className={`edit-ans-btn ${formData.correctAnswer.toUpperCase() === letter ? 'active' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, correctAnswer: letter }))}
                                        >
                                            {letter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Vùng Đáp án cho Tự luận */}
                    {isEssay && (
                        <div>
                            <h3 className="edit-section-title">Đáp án tham khảo / Giải thích</h3>
                            <textarea 
                                className="edit-ex-input"
                                name="correctAnswer"
                                rows="6"
                                value={formData.correctAnswer}
                                onChange={handleChange}
                                placeholder="Nhập đáp án tự luận..."
                            />
                        </div>
                    )}

                    {/* Vùng Giải thích chung */}
                    {!isEssay && (
                        <div>
                            <h3 className="edit-section-title">Nhận xét / Giải thích chi tiết</h3>
                            <textarea 
                                className="edit-ex-input"
                                name="explanation"
                                rows="3"
                                value={formData.explanation}
                                onChange={handleChange}
                                placeholder="Nhập giải thích cho bài tập..."
                            />
                        </div>
                    )}
                </div>

                <div className="edit-ex-footer">
                    <button className="edit-ex-btn-cancel" onClick={onClose} disabled={isSubmitting}>
                        Hủy
                    </button>
                    <button className="edit-ex-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                        Cập nhật bài tập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditExerciseModal;
