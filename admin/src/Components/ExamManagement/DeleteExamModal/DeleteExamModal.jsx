import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './DeleteExamModal.css';

const DeleteExamModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-backdrop">
            <div className="delete-modal-content">
                <button className="delete-modal-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                <div className="delete-modal-icon-wrapper">
                    <AlertTriangle size={32} />
                </div>
                <h3>Xác nhận xóa</h3>
                <p>Bạn có chắc chắn muốn xóa đề này không?</p>
                <div className="delete-modal-actions">
                    <button className="delete-modal-cancel-btn" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="delete-modal-confirm-btn" onClick={onConfirm}>
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteExamModal;
