import React, { useState } from 'react';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import './DeleteVideoModal.css';

const DeleteVideoModal = ({ isOpen, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="delete-video-backdrop">
            <div className="delete-video-container">
                <button className="delete-video-close" onClick={onClose} disabled={isDeleting}>
                    <X size={20} />
                </button>
                
                <div className="delete-video-content">
                    <div className="delete-video-icon-bg">
                        <AlertCircle size={32} color="#ef4444" />
                    </div>
                    
                    <h3 className="delete-video-title">Xóa bài giảng</h3>
                    <p className="delete-video-text">
                        Bạn có chắc chắn muốn xóa bài giảng này không? Hình ảnh đính kèm và dữ liệu liên quan sẽ bị gỡ bỏ.
                    </p>
                </div>

                <div className="delete-video-actions">
                    <button 
                        className="delete-video-btn-cancel" 
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Hủy
                    </button>
                    <button 
                        className="delete-video-btn-confirm" 
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 size={18} className="spinner" /> : 'Xóa bài giảng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteVideoModal;
