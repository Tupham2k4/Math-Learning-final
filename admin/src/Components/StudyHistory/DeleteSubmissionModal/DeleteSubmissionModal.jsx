import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './DeleteSubmissionModal.css';

const DeleteSubmissionModal = ({ isOpen, onClose, onConfirm, submission, isDeleting }) => {
    if (!isOpen || !submission) return null;

    const studentName = submission.userName || submission.user?.name || "Khách";
    const lessonTitle = submission.lessonTitle || submission.lesson?.title || "Không rõ";
    const itemType = submission.hasEssay ? "Tự luận" : "Trắc nghiệm";
    const currentScore = submission.score !== undefined ? Number(submission.score).toFixed(2) : "0.00";

    return (
        <div className="delete-submission-overlay" onClick={onClose}>
            <div className="delete-submission-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <div className="delete-submission-content">
                    <div className="warning-icon-container">
                        <AlertCircle size={48} className="warning-icon" />
                    </div>
                    
                    <h2 className="delete-title">Bạn có chắc chắn muốn xóa bài làm này không?</h2>
                    <p className="delete-description">
                        Sau khi xóa, toàn bộ câu trả lời, điểm số và lịch sử chấm điểm liên quan cũng sẽ bị xóa theo. Hành động này không thể hoàn tác.
                    </p>

                    <div className="submission-info-box">
                        <div className="info-row">
                            <span className="info-label">Tên học sinh:</span>
                            <span className="info-value font-medium">{studentName}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Tên bài tập:</span>
                            <span className="info-value">{lessonTitle}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Loại bài:</span>
                            <span className={`info-value badge ${submission.hasEssay ? 'badge-essay' : 'badge-mcq'}`}>
                                {itemType}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Điểm hiện tại:</span>
                            <span className="info-value score-value">{currentScore}</span>
                        </div>
                    </div>
                </div>

                <div className="delete-submission-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={isDeleting}>
                        Hủy
                    </button>
                    <button className="btn-delete-confirm" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Đang xóa..." : "Xóa bài làm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSubmissionModal;
