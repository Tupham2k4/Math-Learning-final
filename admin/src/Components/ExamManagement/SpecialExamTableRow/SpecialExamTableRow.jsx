import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './SpecialExamTableRow.css';

const SpecialExamTableRow = ({ exam, index, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    const stt = (currentPage - 1) * limit + index + 1;
    
    const examName = exam.title || '-';
    
    // Danh mục đề thi đặc biệt 
    const categoryLabels = {
        'vao10': 'Đề thi vào 10 cấp tỉnh',
        'thpt': 'Đề thi THPT Quốc gia',
        'hsg': 'Đề thi chọn HSG cấp tỉnh các tỉnh',
        'thi_thu': 'Đề thi thử THPT Quốc gia của các tỉnh và trường',
        'khac': 'Khác'
    };
    
    const categoryName = categoryLabels[exam.category] || exam.category || '-';

    return (
        <tr className="exam-table-row special-table-row">
            <td className="td-stt">{stt}</td>
            <td className="td-name">
                <div className="exam-name-text" title={examName}>{examName}</div>
            </td>
            <td className="td-category">
                <span className={`exam-category-badge cat-${exam.category || 'default'}`}>
                    {categoryName}
                </span>
            </td>
            <td className="td-actions">
                <div className="special-exam-action-buttons text-center">
                                   {onView && (
                                       <button 
                                           className="btn-action-view" 
                                           title="Xem chi tiết"
                                           onClick={() => onView(exam)}
                                       >
                                           <Eye size={16} />
                                       </button>
                                   )}
                                   <button 
                                       className="btn-action-edit" 
                                       title="Sửa đề"
                                       onClick={() => onEdit && onEdit(exam)}
                                   >
                                       <Edit size={16} />
                                   </button>
                                   <button 
                                       className="btn-action-delete" 
                                       title="Xóa đề"
                                       onClick={() => onDelete && onDelete(exam._id)}
                                   >
                                       <Trash2 size={16} />
                                   </button>
                </div>
            </td>
        </tr>
    );
};

export default SpecialExamTableRow;
