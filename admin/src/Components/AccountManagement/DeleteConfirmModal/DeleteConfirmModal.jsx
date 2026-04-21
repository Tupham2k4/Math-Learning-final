import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        try {
            await onConfirm();
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
            setError(err.message || "Đã xảy ra lỗi khi xóa tài khoản.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-modal-backdrop">
            <div className="delete-confirm-modal">
                <div className="delete-modal-content">
                    <div className="delete-icon-wrapper">
                        <AlertTriangle size={32} />
                    </div>
                    
                    <h3>Xóa tài khoản</h3>
                    <p>Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác.</p>
                    
                    {error && <div className="delete-modal-error">{error}</div>}

                    <div className="delete-modal-actions">
                        <button 
                            className="btn-delete-cancel" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button 
                            className="btn-delete-confirm" 
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? 'Đang xóa...' : 'Xóa'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
