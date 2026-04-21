import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Edit, Upload, Trash2, FileText } from 'lucide-react';
import './EditExamModal.css';

const EditExamModal = ({ isOpen, onClose, selectedLesson, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [currentPdfUrl, setCurrentPdfUrl] = useState('');
    const [pdfRemoved, setPdfRemoved] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load dữ liệu cũ khi mở modal
    useEffect(() => {
        if (isOpen && selectedLesson) {
            setTitle(selectedLesson.title || '');
            setCategory(selectedLesson.category || '');
            setCurrentPdfUrl(selectedLesson.pdfUrl || '');
            setNewFile(null);
            setPdfRemoved(false);
            setError('');
        }
    }, [isOpen, selectedLesson]);

    if (!isOpen || !selectedLesson) return null;

    const isSpecial = selectedLesson.type === 'special';

    const chapterName = selectedLesson.chapterId?.title || '-';
    const gradeNum = (() => {
        const raw = selectedLesson.grade || selectedLesson.chapterId?.grade;
        return raw ? String(raw).replace(/\D/g, '') : '-';
    })();

    const categoryLabels = {
        'vao10': 'Đề thi vào 10 cấp tỉnh',
        'thpt': 'Đề thi THPT Quốc gia',
        'hsg': 'Đề thi chọn HSG cấp tỉnh các tỉnh',
        'thi_thu': 'Đề thi thử THPT Quốc gia của các tỉnh và trường',
        'khac': 'Khác'
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewFile(e.target.files[0]);
            setPdfRemoved(false);
        }
    };

    const handleRemovePdf = () => {
        setCurrentPdfUrl('');
        setNewFile(null);
        setPdfRemoved(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) return setError("Tên đề không được để trống!");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title.trim());

            if (isSpecial) {
                formData.append('category', category);
            }

            if (newFile) {
                formData.append('pdf', newFile);
            } else if (pdfRemoved) {
                formData.append('pdfUrl', '');
            }

            const response = await axios.put(
                `http://localhost:4000/api/exams/${selectedLesson._id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data.success || response.data) {
                onSubmit && onSubmit(response.data.data);
                onClose();
            } else {
                setError("Cập nhật thất bại.");
            }
        } catch (err) {
            console.error("Lỗi cập nhật đề:", err);
            setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const hasPdf = !pdfRemoved && (newFile || currentPdfUrl);

    return (
        <div className="edit-exam-modal-backdrop">
            <div className="edit-exam-modal">
                {/* Header */}
                <div className="eem-header">
                    <div className="eem-title-group">
                        <div className={`eem-icon-wrapper ${isSpecial ? 'special' : 'normal'}`}>
                            <Edit size={20} />
                        </div>
                        <div>
                            <h2>Chỉnh sửa kho đề</h2>
                            <span className={`eem-type-badge ${isSpecial ? 'badge-special' : 'badge-normal'}`}>
                                {isSpecial ? 'Đề đặc biệt' : 'Đề theo chương'}
                            </span>
                        </div>
                    </div>
                    <button className="eem-close-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="eem-body">
                    {error && <div className="eem-error">{error}</div>}

                    {/* Thông tin cố định (chỉ đọc) */}
                    {!isSpecial && (
                        <div className="eem-readonly-grid">
                            <div className="eem-readonly-item">
                                <label>Khối lớp</label>
                                <div className="eem-readonly-value">
                                    <span className="badge badge-blue">Lớp {gradeNum}</span>
                                </div>
                            </div>
                            <div className="eem-readonly-item">
                                <label>Chương học</label>
                                <div className="eem-readonly-value chapter-name">{chapterName}</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="eem-form">
                        {/* Tên đề */}
                        <div className="eem-field">
                            <label>Tên đề thi / Tài liệu <span className="required">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                                placeholder="Nhập tên đề..."
                            />
                        </div>

                        {/* Category - chỉ hiển thị khi Special */}
                        {isSpecial && (
                            <div className="eem-field">
                                <label>Danh mục <span className="required">*</span></label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="" disabled>-- Chọn danh mục --</option>
                                    <option value="vao10">Đề thi vào 10 cấp tỉnh</option>
                                    <option value="thpt">Đề thi THPT Quốc gia</option>
                                    <option value="thi_thu">Đề thi thử THPT Quốc gia của các tỉnh và trường</option>
                                    <option value="hsg">Đề thi chọn HSG cấp tỉnh các tỉnh</option>
                                    <option value="khac">Khác</option>
                                </select>
                            </div>
                        )}

                        {/* Quản lý PDF */}
                        <div className="eem-field">
                            <label>Tệp PDF</label>

                            {/* Hiện file cũ */}
                            {currentPdfUrl && !newFile && !pdfRemoved && (
                                <div className="eem-pdf-current">
                                    <div className="eem-pdf-info">
                                        <FileText size={18} className="pdf-icon" />
                                        <span className="eem-pdf-name">File PDF hiện tại</span>
                                        <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer" className="eem-pdf-view-link">Xem</a>
                                    </div>
                                    <button
                                        type="button"
                                        className="eem-pdf-remove-btn"
                                        onClick={handleRemovePdf}
                                        disabled={loading}
                                    >
                                        <Trash2 size={16} />
                                        Xoá PDF
                                    </button>
                                </div>
                            )}

                            {/* Hiện tên file mới */}
                            {newFile && (
                                <div className="eem-pdf-current new-file">
                                    <div className="eem-pdf-info">
                                        <FileText size={18} className="pdf-icon green" />
                                        <span className="eem-pdf-name">{newFile.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="eem-pdf-remove-btn"
                                        onClick={() => setNewFile(null)}
                                        disabled={loading}
                                    >
                                        <X size={16} />
                                        Bỏ chọn
                                    </button>
                                </div>
                            )}

                            {/* Ô upload mới */}
                            {(!currentPdfUrl || pdfRemoved) && !newFile && (
                                <div className="eem-upload-wrapper">
                                    <input
                                        type="file"
                                        id="edit-exam-pdf"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="edit-exam-pdf" className="eem-upload-box">
                                        <Upload size={22} className="upload-icon" />
                                        <span>Nhấn để chọn hoặc kéo thả file PDF</span>
                                    </label>
                                </div>
                            )}

                            {/* Nút thay thế PDF khi đang có sẵn */}
                            {currentPdfUrl && !pdfRemoved && !newFile && (
                                <div className="eem-replace-wrapper">
                                    <input
                                        type="file"
                                        id="edit-exam-pdf-replace"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="edit-exam-pdf-replace" className="eem-replace-btn">
                                        <Upload size={15} />
                                        Thay bằng file khác
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="eem-actions">
                            <button type="button" className="eem-cancel-btn" onClick={onClose} disabled={loading}>
                                Hủy bỏ
                            </button>
                            <button type="submit" className="eem-submit-btn" disabled={loading}>
                                <Save size={17} />
                                {loading ? 'Đang lưu...' : 'Cập nhật'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditExamModal;
