import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Edit3 } from 'lucide-react';
import './EditChapterModal.css';

const EditChapterModal = ({ isOpen, onClose, onSuccess, chapterData }) => {
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Hàm useEffect xử lý việc lấy dữ liệu từ API
    useEffect(() => {
        if (chapterData) {
            setTitle(chapterData.title || '');
            
            // Hàm xử lý việc lấy dữ liệu từ API
            let normalizedGrade = chapterData.grade;
            if (typeof normalizedGrade === 'string') {
                normalizedGrade = normalizedGrade.replace('Khối ', '').replace('Lớp ', '').trim();
            }
            setGrade(normalizedGrade || '');
        }
    }, [chapterData, isOpen]);

    if (!isOpen || !chapterData) return null;

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
            const response = await axios.put(`http://localhost:4000/api/chapters/${chapterData._id}`, {
                title: title.trim(),
                grade: grade, 
            });

            if (response.data.success) {
                // Hàm xử lý việc lấy dữ liệu từ API
                onSuccess();
            } else {
                setError(response.data.message || "Cập nhật thất bại.");
            }
        } catch (err) {
            console.error("Lỗi cập nhật chương:", err);
            setError(err.response?.data?.message || "Đã có lỗi xảy ra. Hãy kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="edit-chapter-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <div className="modal-edit-icon-wrapper">
                            <Edit3 size={20} />
                        </div>
                        <h2>Chỉnh sửa chương học</h2>
                    </div>
                    <button className="close-modal-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="modal-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="edit-chapter-form">
                        
                        <div className="form-group">
                            <label>Tên chương học <span className="required">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Nhập tên chương..." 
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

export default EditChapterModal;
