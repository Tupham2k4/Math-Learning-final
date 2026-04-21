import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import './AddMcqExerciseForm.css';

const AddMcqExerciseForm = ({ isOpen, onClose, chapters = [], lessons = [], onSubmit }) => {
    const [formData, setFormData] = useState({
        grade: '',
        chapterId: '',
        lessonId: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: ''
    });

    const [errors, setErrors] = useState({});

    // Reset form khi mở
    useEffect(() => {
        if (isOpen) {
            setFormData({
                grade: '',
                chapterId: '',
                lessonId: '',
                question: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                correctAnswer: 'A',
                explanation: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const grades = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // Lọc danh sách chương theo khối
    const filteredChapters = chapters.filter(c => {
        const cGrade = String(c.grade).replace(/\D/g, '');
        return cGrade === String(formData.grade);
    });

    // Lọc danh sách bài học theo chương
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
        
        // Cập nhật lại dropdown liền kề khi đổi Khối/Chương
        if (name === 'grade') {
            setFormData(prev => ({ ...prev, chapterId: '', lessonId: '' }));
        } else if (name === 'chapterId') {
            setFormData(prev => ({ ...prev, lessonId: '' }));
        }

        // Tự xóa lỗi khi user gõ
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
        if (!formData.optionA.trim()) newErrors.optionA = 'Vui lòng nhập đáp án A';
        if (!formData.optionB.trim()) newErrors.optionB = 'Vui lòng nhập đáp án B';
        if (!formData.optionC.trim()) newErrors.optionC = 'Vui lòng nhập đáp án C';
        if (!formData.optionD.trim()) newErrors.optionD = 'Vui lòng nhập đáp án D';
        if (!formData.explanation.trim()) newErrors.explanation = 'Vui lòng nhập giải thích đáp án';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            // Chuyển đổi format để gửi về Component cha
            const submitData = {
                lessonId: formData.lessonId,
                type: 'mcq',
                question: formData.question,
                options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
                correctAnswer: formData.correctAnswer,
                explanation: formData.explanation,
            };
            if (onSubmit) onSubmit(submitData);
            onClose();
        }
    };

    return (
        <div className="add-mcq-backdrop">
            <div className="add-mcq-modal">
                <div className="add-mcq-header">
                    <h2>Thêm bài tập: Trắc nghiệm</h2>
                    <button className="add-mcq-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="add-mcq-body">
                    {/* Hàng 1: Dropdowns */}
                    <div className="mcq-grid-3">
                        <div className="mcq-form-group">
                            <label>Khối lớp <span className="mcq-req">*</span></label>
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
                            {errors.grade && <span className="mcq-error-text">{errors.grade}</span>}
                        </div>

                        <div className="mcq-form-group">
                            <label>Tên chương <span className="mcq-req">*</span></label>
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
                            {errors.chapterId && <span className="mcq-error-text">{errors.chapterId}</span>}
                        </div>

                        <div className="mcq-form-group">
                            <label>Tên bài tập <span className="mcq-req">*</span></label>
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
                            {errors.lessonId && <span className="mcq-error-text">{errors.lessonId}</span>}
                        </div>
                    </div>

                    {/* Hàng 2: Câu hỏi */}
                    <div className="mcq-form-group">
                        <label>Câu hỏi <span className="mcq-req">*</span></label>
                        <textarea 
                            name="question"
                            rows="4"
                            placeholder="Nhập nội dung câu hỏi..."
                            value={formData.question}
                            onChange={handleChange}
                            className={errors.question ? 'error-border' : ''}
                        />
                        {errors.question && <span className="mcq-error-text">{errors.question}</span>}
                    </div>

                    {/* Hàng 3: Đáp án dạng lưới 2 cột */}
                    <label className="mcq-group-label">Các lựa chọn đáp án <span className="mcq-req">*</span></label>
                    <div className="mcq-grid-2">
                        <div className="mcq-form-group row-flex">
                            <span className="mcq-option-letter">A</span>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    name="optionA" 
                                    placeholder="Nhập đáp án A" 
                                    value={formData.optionA} 
                                    onChange={handleChange}
                                    className={errors.optionA ? 'error-border' : ''}
                                />
                                {errors.optionA && <span className="mcq-error-text">{errors.optionA}</span>}
                            </div>
                        </div>

                        <div className="mcq-form-group row-flex">
                            <span className="mcq-option-letter">B</span>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    name="optionB" 
                                    placeholder="Nhập đáp án B" 
                                    value={formData.optionB} 
                                    onChange={handleChange}
                                    className={errors.optionB ? 'error-border' : ''}
                                />
                                {errors.optionB && <span className="mcq-error-text">{errors.optionB}</span>}
                            </div>
                        </div>

                        <div className="mcq-form-group row-flex">
                            <span className="mcq-option-letter">C</span>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    name="optionC" 
                                    placeholder="Nhập đáp án C" 
                                    value={formData.optionC} 
                                    onChange={handleChange}
                                    className={errors.optionC ? 'error-border' : ''}
                                />
                                {errors.optionC && <span className="mcq-error-text">{errors.optionC}</span>}
                            </div>
                        </div>

                        <div className="mcq-form-group row-flex">
                            <span className="mcq-option-letter">D</span>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    name="optionD" 
                                    placeholder="Nhập đáp án D" 
                                    value={formData.optionD} 
                                    onChange={handleChange}
                                    className={errors.optionD ? 'error-border' : ''}
                                />
                                {errors.optionD && <span className="mcq-error-text">{errors.optionD}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Hàng 4: Đáp án đúng & Giải thích */}
                    <div className="mcq-grid-2 gap-col-24">
                        <div className="mcq-form-group">
                            <label>Đáp án đúng nhất <span className="mcq-req">*</span></label>
                            <div className="correct-answer-selector">
                                {['A', 'B', 'C', 'D'].map(letter => (
                                    <button 
                                        key={letter}
                                        type="button"
                                        className={`ans-btn ${formData.correctAnswer === letter ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, correctAnswer: letter }))}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mcq-form-group">
                            <label>Giải thích đáp án <span className="mcq-req">*</span></label>
                            <textarea 
                                name="explanation"
                                rows="3"
                                placeholder="Giải thích lý do tại sao chọn đáp án này..."
                                value={formData.explanation}
                                onChange={handleChange}
                                className={errors.explanation ? 'error-border' : ''}
                            />
                            {errors.explanation && <span className="mcq-error-text">{errors.explanation}</span>}
                        </div>
                    </div>
                </div>

                <div className="add-mcq-footer">
                    <button className="mcq-btn-submit" onClick={handleSubmit}>
                        <CheckCircle2 size={18} />
                        Thêm bài tập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMcqExerciseForm;
