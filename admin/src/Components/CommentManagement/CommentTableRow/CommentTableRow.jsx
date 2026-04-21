import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import './CommentTableRow.css';

const CommentTableRow = ({ comment, index, currentPage = 1, limit = 10, onView, onDelete }) => {
    // Tính toán số thứ tự dựa theo phân trang
    const stt = (currentPage - 1) * limit + index + 1;
    const formattedDate = comment.createdAt 
        ? new Date(comment.createdAt).toLocaleDateString('vi-VN') 
        : '-';
    return (
        <tr className="comment-table-row">
            <td>{stt}</td>
            <td className="comment-name-cell">
                <span className="comment-name-text">{comment?.user?.name || '-'}</span>
            </td>
            <td>
                <span className="grade-badge">
                    Khối {comment.grade || '-'}
                </span>
            </td>
            <td>{comment.content || '-'}</td>
            <td>{comment?.videoId?.title || '-'}</td>
            <td>{formattedDate}</td>
            <td>
                <div className="comment-action-buttons text-center">
                    {onView && (
                        <button 
                            className="btn-action-view" 
                            title="Xem chi tiết"
                            onClick={() => onView(comment)}
                        >
                            <Eye size={16} />
                        </button>
                    )}
                    <button 
                        className="btn-action-delete" 
                        title="Xóa bình luận"
                        onClick={() => onDelete && onDelete(comment._id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CommentTableRow;
