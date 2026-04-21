import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './LessonTableRow.css';

const LessonTableRow = ({ lesson, index, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    // Tính toán số thứ tự dựa theo phân trang
    const stt = (currentPage - 1) * limit + index + 1;
    const formattedDate = lesson.createdAt 
        ? new Date(lesson.createdAt).toLocaleDateString('vi-VN') 
        : '-';

    return (
        <tr className="lesson-table-row">
            <td>{stt}</td>
            <td className="lesson-name-cell">
                <span className="lesson-name-text">{lesson.title || lesson.name || '-'}</span>
            </td>
            <td>
                <span className="grade-badge">
                    Khối {lesson.grade || '-'}
                </span>
            </td>
            <td>{lesson.chapterName || '-'}</td>
            <td>{formattedDate}</td>
            <td>
                <div className="lesson-action-buttons text-center">
                    {onView && (
                        <button 
                            className="btn-action-view" 
                            title="Xem chi tiết"
                            onClick={() => onView(lesson)}
                        >
                            <Eye size={16} />
                        </button>
                    )}
                    <button 
                        className="btn-action-edit" 
                        title="Sửa bài giảng"
                        onClick={() => onEdit && onEdit(lesson)}
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        className="btn-action-delete" 
                        title="Xóa bài giảng"
                        onClick={() => onDelete && onDelete(lesson._id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default LessonTableRow;
