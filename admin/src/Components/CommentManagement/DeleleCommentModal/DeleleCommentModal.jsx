import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './DeleleCommentModal.css';

const DeleleCommentModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-backdrop">
            <div className="delete-modal-content">
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                <div className="delete-modal-body">
                    <div className="delete-icon-wrapper">
                        <AlertTriangle size={32} />
                    </div>
                    <h3>Xác nhận xóa</h3 >
                    <p>Bạn có chắc chắn muốn xóa comment này không?</p>
                </div>
                <div className="delete-modal-actions">
                    <button className="cancel-delete-btn" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="confirm-delete-btn" onClick={onConfirm}>
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleleCommentModal;
