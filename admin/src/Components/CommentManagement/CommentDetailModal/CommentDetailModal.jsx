import React from 'react';
import { X, MessageSquare, User, Calendar, Layers, Link as LinkIcon } from 'lucide-react';
import './CommentDetailModal.css';

const CommentDetailModal = ({ isOpen, onClose, lesson }) => {
    const comment = lesson; 
    
    if (!isOpen || !comment) return null;

    const formattedDate = new Date(comment.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const videoTitle = comment.videoId?.title || 'Không rõ tên bài giảng';
    const videoLink = comment.videoId?._id 
        ? `http://localhost:3000/video-bai-giang/xem/${comment.videoId._id}` 
        : '#';

    return (
        <div className="comment-detail-backdrop">
            <div className="comment-detail-container">
                <div className="comment-detail-header">
                    <div className="comment-title-area">
                        <h2>{videoTitle}</h2>
                        <div className="comment-meta-badges">
                            <span className="comment-detail-badge badge-blue">
                                <User size={16} /> Từ: {comment.user?.name || '-'}
                            </span>
                            <span className="comment-detail-badge badge-green">
                                <Layers size={16} /> Khối {comment.grade || '-'}
                            </span>
                            <span className="comment-detail-badge badge-gray">
                                <Calendar size={16} /> Lúc: {formattedDate}
                            </span>
                            <a href={videoLink} target="_blank" rel="noopener noreferrer" className="comment-detail-badge badge-purple" style={{ textDecoration: 'none' }}>
                                <LinkIcon size={16} /> Mở video gốc
                            </a>
                        </div>
                    </div>
                    <button onClick={onClose} className="comment-close-btn" title="Đóng">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="comment-detail-body">
                    <div className="comment-content-section">
                        <h3><MessageSquare size={18} color="#3b82f6" /> Nội dung bình luận</h3>
                        <div className="comment-content-text">
                            {comment.content || <span className="comment-empty-text">Chưa có nội dung...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentDetailModal;
