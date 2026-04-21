import React from 'react';
import { X, FileText, Download, Eye, Calendar, BookOpen, Layers, Tag } from 'lucide-react';
import './ExamDetailModal.css';

const ExamDetailModal = ({ isOpen, onClose, exam }) => {
    if (!isOpen || !exam) return null;

    // Formatting date
    const formattedDate = new Date(exam.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Formatting Grade
    const rawGrade = exam.grade || exam.chapterId?.grade;
    const gradeNum = rawGrade ? String(rawGrade).replace(/\D/g, '') : null;

    // Formatting Category
    const categoryLabels = {
        'vao10': 'Đề thi vào 10 cấp tỉnh',
        'thpt': 'Đề thi THPT Quốc gia',
        'hsg': 'Đề thi chọn HSG cấp tỉnh các tỉnh',
        'thi_thu': 'Đề thi thử THPT Quốc gia của các tỉnh và trường',
        'khac': 'Khác'
    };
    const categoryName = exam.category ? (categoryLabels[exam.category] || exam.category) : null;

    const chapterName = exam.chapterId?.title;

    return (
        <div className="detail-modal-backdrop">
            <div className="detail-modal-content exam-detail-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <div className="modal-exam-icon-wrapper info-icon">
                            <FileText size={20} />
                        </div>
                        <h2>Chi tiết Đề thi/Tài liệu</h2>
                    </div>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="detail-info-group">
                        <label>Tên đề / Tài liệu:</label>
                        <div className="detail-value title-value">{exam.title || '-'}</div>
                    </div>

                    <div className="detail-grid">
                        {exam.type === 'chapter' && (
                            <>
                                <div className="detail-info-item">
                                    <Layers size={16} className="detail-icon" />
                                    <div className="detail-text">
                                        <span className="detail-label">Khối lớp:</span>
                                        <span className="detail-badge grade-badge">Lớp {gradeNum || '-'}</span>
                                    </div>
                                </div>
                                <div className="detail-info-item">
                                    <BookOpen size={16} className="detail-icon" />
                                    <div className="detail-text">
                                        <span className="detail-label">Chương học:</span>
                                        <span className="detail-val">{chapterName || '-'}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {exam.type === 'special' && (
                            <div className="detail-info-item">
                                <Tag size={16} className="detail-icon" />
                                <div className="detail-text">
                                    <span className="detail-label">Danh mục:</span>
                                    <span className="detail-badge category-badge">{categoryName || '-'}</span>
                                </div>
                            </div>
                        )}

                        <div className="detail-info-item">
                            <Calendar size={16} className="detail-icon" />
                            <div className="detail-text">
                                <span className="detail-label">Ngày tạo:</span>
                                <span className="detail-val">{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-pdf-section">
                        <label>Tệp đính kèm (PDF):</label>
                        {exam.pdfUrl ? (
                            <div className="pdf-actions">
                                <a 
                                    href={exam.pdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="pdf-btn view-btn"
                                >
                                    <Eye size={18} />
                                    Xem PDF trực tuyến
                                </a>
                                <a 
                                    href={exam.pdfUrl} 
                                    download={`De-thi-${exam._id}.pdf`}
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="pdf-btn download-btn"
                                >
                                    <Download size={18} />
                                    Tải PDF về máy
                                </a>
                            </div>
                        ) : (
                            <div className="no-pdf-text">Không có tệp PDF đính kèm.</div>
                        )}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn block-btn" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamDetailModal;
