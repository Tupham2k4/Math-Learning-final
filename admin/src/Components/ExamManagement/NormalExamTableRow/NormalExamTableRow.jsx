import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './NormalExamTableRow.css';

const NormalExamTableRow = ({ exam, index, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    // Tính toán số thứ tự dựa trên trang hiện tại
    const stt = (currentPage - 1) * limit + index + 1;
    
    // Fallback dữ liệu nếu chưa populate
    const examName = exam.title || '-';
    // Đề theo chương thường link chapterId
    const chapterName = exam.chapterId?.title || '-';
    const gradeVal = exam.grade || exam.chapterId?.grade || '-';
    // Lọc lấy số lớp
    const gradeNum = String(gradeVal).replace(/\D/g, '') || '-';

    return (
        <tr className="exam-table-row">
            <td className="td-stt">{stt}</td>
            <td className="td-name">
                <div className="exam-name-text" title={examName}>{examName}</div>
            </td>
            <td className="td-grade">
                <span className="exam-grade-badge">Khối {gradeNum}</span>
            </td>
            <td className="td-chapter">
                <div className="exam-chapter-text" title={chapterName}>{chapterName}</div>
            </td>
            <td className="td-actions">
                <div className="normal-exam-action-buttons text-center">
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

export default NormalExamTableRow;
