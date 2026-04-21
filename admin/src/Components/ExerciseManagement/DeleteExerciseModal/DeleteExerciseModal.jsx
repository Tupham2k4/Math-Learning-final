import React, { useState } from 'react';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import './DeleteExerciseModal.css';

const DeleteExerciseModal = ({ isOpen, onClose, onConfirm }) => {
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
        <div className="delete-exercise-backdrop">
            <div className="delete-exercise-container">
                <button className="delete-exercise-close" onClick={onClose} disabled={isDeleting}>
                    <X size={20} />
                </button>
                
                <div className="delete-exercise-content">
                    <div className="delete-exercise-icon-bg">
                        <AlertCircle size={32} color="#ef4444" />
                    </div>
                    
                    <h3 className="delete-exercise-title">Xóa bài tập</h3>
                    <p className="delete-exercise-text">
                        Bạn có chắc chắn muốn xóa bài tập này không? Hình ảnh đính kèm và dữ liệu liên quan sẽ bị gỡ bỏ.
                    </p>
                </div>

                <div className="delete-exercise-actions">
                    <button 
                        className="delete-exercise-btn-cancel" 
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Hủy
                    </button>
                    <button 
                        className="delete-exercise-btn-confirm" 
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 size={18} className="spinner" /> : 'Xóa bài tập'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteExerciseModal;
