import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './VideoTableRow.css';
const VideoTableRow = ({video, index, currentPage = 1, limit = 10, onView, onEdit, onDelete}) => {
    // Tính toán số thứ tự dựa theo phân trang
    const stt = (currentPage - 1) * limit + index + 1;
    const formattedDate = video.createdAt 
        ? new Date(video.createdAt).toLocaleDateString('vi-VN') 
        : '-';
    return (
         <tr className="video-table-row">
            <td>{stt}</td>
            <td className="video-name-cell">
                <span className="video-name-text">{video.title || video.name || '-'}</span>
            </td>
            <td>
                <span className="grade-badge">
                    Khối {video.grade || '-'}
                </span>
            </td>
            <td>{video.chapterName || '-'}</td>
            <td>{formattedDate}</td>
            <td>
                <div className="video-action-buttons text-center">
                    {onView && (
                        <button 
                            className="btn-action-view" 
                            title="Xem chi tiết"
                            onClick={() => onView(video)}
                        >
                            <Eye size={16} />
                        </button>
                    )}
                    <button 
                        className="btn-action-edit" 
                        title="Sửa video bài giảng"
                        onClick={() => onEdit && onEdit(video)}
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        className="btn-action-delete" 
                        title="Xóa video bài giảng"
                        onClick={() => onDelete && onDelete(video._id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};
export default VideoTableRow;