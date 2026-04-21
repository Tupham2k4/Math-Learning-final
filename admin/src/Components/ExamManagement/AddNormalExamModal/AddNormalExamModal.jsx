import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, FileText, Upload } from 'lucide-react';
import './AddNormalExamModal.css';

const AddNormalExamModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [chapters, setChapters] = useState([]);
    const [file, setFile] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const grades = Array.from({ length: 12 }, (_, i) => String(i + 1));

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
            
            setTitle('');
            setGrade('');
            setChapterId('');
            setFile(null);
            setError('');
        }
    }, [isOpen]);

    useEffect(() => {
        setChapterId('');
    }, [grade]);

    if (!isOpen) return null;

    const filteredChapters = chapters.filter(chap => {
        if (!grade) return false;
        const chapGrade = chap.grade?.toString() || "";
        return chapGrade === grade || `Lớp ${chapGrade}` === `Lớp ${grade}` || chapGrade.includes(grade);
    });

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) return setError("Tên đề kiểm tra không được để trống!");
        if (!grade) return setError("Vui lòng chọn khối lớp!");
        if (!chapterId) return setError("Vui lòng chọn chương tương ứng!");
        if (!file) return setError("Vui lòng tải lên file PDF của đề thi!");

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('type', 'chapter');
            formData.append('grade', grade);
            formData.append('chapterId', chapterId);
            formData.append('pdf', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await axios.post('http://localhost:4000/api/exams', formData, config);

            // Tùy theo cấu trúc resp backend trả về
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
            <div className="add-exam-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <div className="modal-exam-icon-wrapper">
                            <FileText size={20} />
                        </div>
                        <h2>Thêm đề thi theo chương</h2>
                    </div>
                    <button className="close-modal-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="modal-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="add-exam-form">
                        <div className="form-group">
                            <label>Tên đề thi <span className="required">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Nhập tên đề thi (ví dụ: Đề kiểm tra Chương 1)" 
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
                                    onChange={(e) => setGrade(e.target.value)}
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

                        <div className="form-group">
                            <label>Upload đề thi (PDF) <span className="required">*</span></label>
                            <div className="file-upload-wrapper">
                                <input 
                                    type="file" 
                                    id="exam-pdf-upload"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="exam-pdf-upload" className="file-upload-box">
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
                                className="save-exam-btn" 
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

export default AddNormalExamModal;
