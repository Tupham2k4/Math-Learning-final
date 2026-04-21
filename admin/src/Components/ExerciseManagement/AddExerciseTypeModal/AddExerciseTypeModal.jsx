import React from 'react';
import { X, CheckSquare, AlignLeft } from 'lucide-react';
import './AddExerciseTypeModal.css';

const AddExerciseTypeModal = ({ isOpen, onClose, onSelectType }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target.className === 'add-ex-type-backdrop') {
            onClose();
        }
    };

    return (
        <div className="add-ex-type-backdrop" onClick={handleBackdropClick}>
            <div className="add-ex-type-modal">
                <button 
                    className="add-ex-type-close" 
                    onClick={onClose} 
                    title="Đóng cửa sổ"
                >
                    <X size={24} />
                </button>
                
                <div className="add-ex-type-header">
                    <h2>Thêm bài tập</h2>
                    <p>Chọn loại bài tập</p>
                </div>
                
                <div className="add-ex-type-body">
                    <button 
                        className="ex-type-btn btn-mcq" 
                        onClick={() => onSelectType('mcq')}
                    >
                        <CheckSquare size={36} />
                        <span>Trắc nghiệm</span>
                    </button>
                    
                    <button 
                        className="ex-type-btn btn-essay" 
                        onClick={() => onSelectType('essay')}
                    >
                        <AlignLeft size={36} />
                        <span>Tự luận</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExerciseTypeModal;
