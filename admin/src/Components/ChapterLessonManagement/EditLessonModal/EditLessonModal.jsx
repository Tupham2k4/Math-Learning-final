import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Edit3 } from 'lucide-react';
import './EditLessonModal.css';

const EditLessonModal = ({ isOpen, onClose, onSuccess, lessonData }) => {
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [chapters, setChapters] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const grades = Array.from({ length: 12 }, (_, i) => String(i + 1));

    // Lấy toàn bộ chapters mỗi khi Modal mở ra để lấy list select
    useEffect(() => {
        if (isOpen) {
            const fetchChapters = async () => {
                try {
                    const res = await axios.get('http://localhost:4000/api/chapters');
                    const data = res.data.data || res.data || [];
                    setChapters(data);
                } catch (err) {
                    console.error("Lỗi khi tải danh sách chương:", err);
                    setError("Không thể lấy danh sách chương, vui lòng thử lại.");
                }
            };
            fetchChapters();
        }
    }, [isOpen]);

    // Pre-fill dữ liệu khi lessonData thay đổi
    useEffect(() => {
        if (lessonData && isOpen) {
            setTitle(lessonData.title || '');
            
            // Xử lý làm sạch chuỗi grade
            let normalizedGrade = lessonData.grade || '';
            // Nếu có chapter info được populate, fallback grade
            if (!normalizedGrade && lessonData.chapterId && lessonData.chapterId.grade) {
                normalizedGrade = lessonData.chapterId.grade;
            }
            if (typeof normalizedGrade === 'string') {
                normalizedGrade = normalizedGrade.replace('Khối ', '').replace('Lớp ', '').trim();
            }
            setGrade(normalizedGrade);

            // Xử lý gán chapterId dạng String hay tham chiếu populate Object
            if (lessonData.chapterId) {
                setChapterId(typeof lessonData.chapterId === 'object' ? lessonData.chapterId._id : lessonData.chapterId);
            } else {
                setChapterId('');
            }
        }
    }, [lessonData, isOpen]);

    // Xử lý auto reset chuơng khi đổi khối lớp khác với khối nguyên thuỷ (sau khi user đã load xong dl)
    const handleGradeChange = (e) => {
        setGrade(e.target.value);
        setChapterId(''); // Xoá chương đi bắt bấm lại
    };

    if (!isOpen || !lessonData) return null;

    // Lọc ra các chapter tương ứng với lớp
    const filteredChapters = chapters.filter(chap => {
        if (!grade) return false;
        const chapGrade = chap.grade?.toString() || "";
        return chapGrade === grade || `Lớp ${chapGrade}` === `Lớp ${grade}` || chapGrade.includes(grade);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            return setError("Tên bài không được để trống!");
        }

        if (!grade) {
            return setError("Vui lòng chọn khối lớp!");
        }

        if (!chapterId) {
            return setError("Vui lòng chọn chương tương ứng!");
        }

        setLoading(true);

        try {
            const response = await axios.put(`http://localhost:4000/api/lessons/${lessonData._id}`, {
                title: title.trim(),
                grade: grade, 
                chapterId: chapterId,
            });

            if (response.data.success) {
                onSuccess();
            } else {
                setError(response.data.message || "Cập nhật thất bại.");
            }
        } catch (err) {
            console.error("Lỗi cập nhật bài giảng:", err);
            setError(err.response?.data?.message || "Đã có lỗi xảy ra. Hãy kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="edit-lesson-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <div className="modal-edit-icon-wrapper">
                            <Edit3 size={20} />
                        </div>
                        <h2>Chỉnh sửa bài giảng</h2>
                    </div>
                    <button className="close-modal-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="modal-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="edit-lesson-form">
                        
                        <div className="form-group">
                            <label>Tên bài giảng <span className="required">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Nhập tên bài..." 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Khối lớp <span className="required">*</span></label>
                                <select 
                                    value={grade} 
                                    onChange={handleGradeChange}
                                    disabled={loading}
                                >
                                    <option value="" disabled>-- Chọn khối --</option>
                                    {grades.map(g => (
                                        <option key={g} value={g}>Lớp {g}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group half-width">
                                <label>Thuộc chương học <span className="required">*</span></label>
                                <select 
                                    value={chapterId} 
                                    onChange={(e) => setChapterId(e.target.value)}
                                    disabled={loading || !grade} 
                                >
                                    <option value="" disabled>
                                        {grade ? '-- Chọn chương --' : 'Hãy chọn khối trước'}
                                    </option>
                                    {filteredChapters.map(chap => (
                                        <option key={chap._id} value={chap._id}>
                                            {chap.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button 
                                type="button" 
                                className="cancel-btn" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit" 
                                className="save-edit-btn" 
                                disabled={loading}
                            >
                                <Save size={18} />
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditLessonModal;
