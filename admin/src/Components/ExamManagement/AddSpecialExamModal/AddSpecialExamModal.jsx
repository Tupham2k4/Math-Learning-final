import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Bookmark, Upload } from 'lucide-react';
import './AddSpecialExamModal.css';

const AddSpecialExamModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setCategory('');
            setFile(null);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) return setError("Tên đề kiểm tra không được để trống!");
        if (!category) return setError("Vui lòng chọn loại tài liệu (danh mục)!");
        if (!file) return setError("Vui lòng tải lên file PDF của đề thi!");

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('type', 'special');
            formData.append('category', category);
            formData.append('pdf', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await axios.post('http://localhost:4000/api/exams', formData, config);

            if (response.data.success || response.data) {
                onSuccess();
            } else {
                setError("Tạo đề thi thất bại.");
            }
        } catch (err) {
            console.error("Lỗi tạo đề thi:", err);
            setError(err.response?.data?.message || "Đã có lỗi xảy ra. Hãy kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="add-special-exam-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <div className="modal-special-exam-icon-wrapper">
                            <Bookmark size={20} />
                        </div>
                        <h2>Thêm đề & Tài liệu đặc biệt</h2>
                    </div>
                    <button className="close-modal-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="modal-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="add-special-exam-form">
                        <div className="form-group">
                            <label>Tên đề thi/Tài liệu <span className="required">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Nhập tên đề/tài liệu..." 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Danh mục (Category) <span className="required">*</span></label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={loading}
                            >
                                <option value="" disabled>-- Chọn loại tài liệu --</option>
                                <option value="vao10">Đề thi vào 10 cấp tỉnh</option>
                                <option value="thpt">Đề thi THPT Quốc gia</option>
                                <option value="thi_thu">Đề thi thử THPT Quốc gia của các tỉnh và các trường</option>
                                <option value="hsg">Đề thi chọn HSG cấp tỉnh các tỉnh</option>
                                <option value="khac">Khác</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Upload đề thi (PDF) <span className="required">*</span></label>
                            <div className="file-upload-wrapper">
                                <input 
                                    type="file" 
                                    id="special-exam-pdf-upload"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="special-exam-pdf-upload" className="file-upload-box">
                                    <Upload size={24} className="upload-icon" />
                                    <span className="upload-text">
                                        {file ? file.name : "Nhấn để chọn hoặc kéo thả file PDF vào đây"}
                                    </span>
                                </label>
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
                                className="save-exam-btn special" 
                                disabled={loading}
                            >
                                <Save size={18} />
                                {loading ? 'Đang thêm...' : 'Thêm đề'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSpecialExamModal;
