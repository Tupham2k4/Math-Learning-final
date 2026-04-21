import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './ExerciseTableRow.css';

const ExerciseTableRow = ({ lesson, index, currentPage, limit, onView, onEdit, onDelete }) => {
    if (!lesson) return null;

    // Tính STT
    const stt = (currentPage - 1) * limit + (index + 1);

    // Xử lý lấy thông tin
    const exerciseName = lesson.lessonName || lesson.lessonId?.title || 'Chưa cập nhật đổi';
    const rawGrade = lesson.grade || lesson.lessonId?.chapterId?.grade || '-';
    // Ép kiểu để chỉ hiển thị số
    const gradeNum = String(rawGrade).replace(/\D/g, '') || '-';
    const chapterName = lesson.chapterName || lesson.lessonId?.chapterId?.title || '-';

    // Xử lý loại câu hỏi
    const isMcq = lesson.type === 'mcq';
    const typeLabel = isMcq ? 'Trắc nghiệm' : lesson.type === 'essay' ? 'Tự luận' : 'Khác';
    const typeBadgeClass = isMcq ? 'exercise-badge-mcq' : 'exercise-badge-essay';

    return (
        <tr className="exercise-table-row">
            <td className="exercise-cell-stt">{stt}</td>
            
            <td className="exercise-cell-name">
                <span className="exercise-name-text">
                    {exerciseName}
                </span>
            </td>
            
            <td className="exercise-cell-grade">
                <span className="exercise-grade-badge">
                    Khối {gradeNum}
                </span>
            </td>
            
            <td className="exercise-cell-chapter">
                {chapterName}
            </td>
            
            <td className="exercise-cell-type">
                <span className={`exercise-type-badge ${typeBadgeClass}`}>
                    {typeLabel}
                </span>
            </td>

            <td className="exercise-cell-actions">
                <div className="exercise-actions-wrapper">
                    <button 
                        className="exercise-action-btn action-view"
                        onClick={() => onView && onView(lesson)}
                        title="Xem chi tiết câu hỏi"
                    >
                        <Eye size={18} />
                    </button>
                    <button 
                        className="exercise-action-btn action-edit"
                        onClick={() => onEdit && onEdit(lesson)}
                        title="Chỉnh sửa câu hỏi"
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                        className="exercise-action-btn action-delete"
                        onClick={() => onDelete && onDelete(lesson)}
                        title="Xóa câu hỏi"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ExerciseTableRow;
