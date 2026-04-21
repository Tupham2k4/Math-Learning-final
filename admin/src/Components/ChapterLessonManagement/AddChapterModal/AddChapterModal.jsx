import React, { useState } from 'react';
import axios from 'axios';
import { X, Save, BookOpen } from 'lucide-react';
import './AddChapterModal.css';

const AddChapterModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const grades = Array.from({ length: 12 }, (_, i) => String(i + 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            return setError("Tên chương không được để trống!");
        }

        if (!grade) {
            return setError("Vui lòng chọn khối lớp!");
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:4000/api/chapters', {
                title: title.trim(),
                grade: grade, // Hoặc "Khoi " + grade tuỳ schema (để giữ tĩnh dạng số 1, 2, ... thì truyền trực tiếp)
            });

            if (response.data.success) {
                // Reset form
                setTitle('');
                setGrade('');
                // Gọi success callback để reload danh sách
                onSuccess();
            } else {
                setError(response.data.message || "Tạo mới thất bại.");
            }
        } catch (err) {
            console.error("Lỗi tạo chương:", err);
            setError(err.response?.data?.message || "Đã có lỗi xảy ra. Hãy kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="add-chapter-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <div className="modal-icon-wrapper">
                            <BookOpen size={20} />
                        </div>
                        <h2>Thêm chương học mới</h2>
                    </div>
                    <button className="close-modal-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="modal-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="add-chapter-form">
                        
                        <div className="form-group">
                            <label>Tên chương học <span className="required">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Nhập tên chương (ví dụ: Hình học không gian)" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Thuộc khối lớp <span className="required">*</span></label>
                            <select 
                                value={grade} 
                                onChange={(e) => setGrade(e.target.value)}
                                disabled={loading}
                            >
                                <option value="" disabled>-- Chọn khối lớp --</option>
                                {grades.map(g => (
                                    <option key={g} value={g}>Lớp {g}</option>
                                ))}
                            </select>
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
                                className="save-btn" 
                                disabled={loading}
                            >
                                <Save size={18} />
                                {loading ? 'Đang lưu...' : 'Lưu chương'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddChapterModal;
