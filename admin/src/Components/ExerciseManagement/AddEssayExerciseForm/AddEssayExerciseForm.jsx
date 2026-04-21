import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import './AddEssayExerciseForm.css';

const AddEssayExerciseForm = ({ isOpen, onClose, chapters = [], lessons = [], onSubmit }) => {
    const [formData, setFormData] = useState({
        grade: '',
        chapterId: '',
        lessonId: '',
        question: '',
        correctAnswer: ''
    });

    const [errors, setErrors] = useState({});

    // Reset data mỗi khi mở Modal
    useEffect(() => {
        if (isOpen) {
            setFormData({
                grade: '',
                chapterId: '',
                lessonId: '',
                question: '',
                correctAnswer: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const grades = Array.from({ length: 12 }, (_, i) => i + 1);

    const filteredChapters = chapters.filter(c => {
        const cGrade = String(c.grade).replace(/\D/g, '');
        return cGrade === String(formData.grade);
    });

    const filteredLessons = lessons.filter(l => {
        const lChap = typeof l.chapterId === 'object' ? l.chapterId?._id : l.chapterId;
        return String(lChap) === String(formData.chapterId);
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'grade') {
            setFormData(prev => ({ ...prev, chapterId: '', lessonId: '' }));
        } else if (name === 'chapterId') {
            setFormData(prev => ({ ...prev, lessonId: '' }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.grade) newErrors.grade = 'Vui lòng chọn khối lớp';
        if (!formData.chapterId) newErrors.chapterId = 'Vui lòng chọn chương';
        if (!formData.lessonId) newErrors.lessonId = 'Vui lòng chọn bài tập';
        if (!formData.question.trim()) newErrors.question = 'Vui lòng nhập nội dung câu hỏi';
        if (!formData.correctAnswer.trim()) newErrors.correctAnswer = 'Vui lòng nhập đáp án / giải thích';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            const submitData = {
                lessonId: formData.lessonId,
                type: 'essay',
                question: formData.question,
                correctAnswer: formData.correctAnswer,
                explanation: '',
                options: [] 
            };
            if (onSubmit) onSubmit(submitData);
            onClose();
        }
    };

    return (
        <div className="add-essay-backdrop">
            <div className="add-essay-modal">
                <div className="add-essay-header">
                    <h2>Thêm bài tập: Tự luận</h2>
                    <button className="add-essay-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="add-essay-body">
                    {/* Danh sách lọc Bài tập */}
                    <div className="essay-grid-3">
                        <div className="essay-form-group">
                            <label>Khối lớp <span className="essay-req">*</span></label>
                            <select 
                                name="grade" 
                                value={formData.grade} 
                                onChange={handleChange}
                                className={errors.grade ? 'error-border' : ''}
                            >
                                <option value="">-- Chọn khối --</option>
                                {grades.map(g => (
                                    <option key={g} value={g}>Khối {g}</option>
                                ))}
                            </select>
                            {errors.grade && <span className="essay-error-text">{errors.grade}</span>}
                        </div>

                        <div className="essay-form-group">
                            <label>Tên chương <span className="essay-req">*</span></label>
                            <select 
                                name="chapterId" 
                                value={formData.chapterId} 
                                onChange={handleChange}
                                disabled={!formData.grade}
                                className={errors.chapterId ? 'error-border' : ''}
                            >
                                <option value="">-- Chọn chương --</option>
                                {filteredChapters.map(c => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                            {errors.chapterId && <span className="essay-error-text">{errors.chapterId}</span>}
                        </div>

                        <div className="essay-form-group">
                            <label>Tên bài tập <span className="essay-req">*</span></label>
                            <select 
                                name="lessonId" 
                                value={formData.lessonId} 
                                onChange={handleChange}
                                disabled={!formData.chapterId}
                                className={errors.lessonId ? 'error-border' : ''}
                            >
                                <option value="">-- Chọn bài học --</option>
                                {filteredLessons.map(l => (
                                    <option key={l._id} value={l._id}>{l.title}</option>
                                ))}
                            </select>
                            {errors.lessonId && <span className="essay-error-text">{errors.lessonId}</span>}
                        </div>
                    </div>

                    {/* Vùng Textareas cho Tự luận */}
                    <div className="essay-form-group">
                        <label>Đề bài (Câu hỏi) <span className="essay-req">*</span></label>
                        <textarea 
                            name="question"
                            rows="4"
                            placeholder="Nhập nội dung đề bài tự luận..."
                            value={formData.question}
                            onChange={handleChange}
                            className={errors.question ? 'error-border' : ''}
                        />
                        {errors.question && <span className="essay-error-text">{errors.question}</span>}
                    </div>

                    <div className="essay-form-group">
                        <label>Đáp án & Giải thích (Chi tiết) <span className="essay-req">*</span></label>
                        <textarea 
                            name="correctAnswer"
                            rows="7"
                            placeholder="Nhập đáp án chuẩn, giải thích hoặc Bareme chấm điểm..."
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            className={errors.correctAnswer ? 'error-border' : ''}
                        />
                        {errors.correctAnswer && <span className="essay-error-text">{errors.correctAnswer}</span>}
                    </div>
                </div>

                <div className="add-essay-footer">
                    <button className="essay-btn-submit" onClick={handleSubmit}>
                        <CheckCircle2 size={18} />
                        Thêm bài tập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEssayExerciseForm;
