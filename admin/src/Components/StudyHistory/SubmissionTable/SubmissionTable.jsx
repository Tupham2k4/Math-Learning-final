import React, { useState } from 'react';
import { Eye, CheckSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './SubmissionTable.css';

const SubmissionTable = ({ 
    submissions = [], 
    onView, 
    onGrade, 
    onDelete 
}) => {
    // Phân trang (Pagination)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Tính toán dữ liệu phân trang
    const totalPages = Math.ceil(submissions.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = submissions.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="submission-table-container">
            <div className="submission-table-wrapper">
                <table className="submission-table">
                    <thead>
                        <tr>
                            <th className="st-col-id">STT</th>
                            <th className="st-col-name">Tên học sinh</th>
                            <th className="st-col-lesson">Tên bài tập</th>
                            <th className="st-col-grade">Lớp</th>
                            <th className="st-col-type">Loại bài</th>
                            <th className="st-col-score">Điểm</th>
                            <th className="st-col-status">Trạng thái</th>
                            <th className="st-col-date">Ngày nộp</th>
                            <th className="st-col-actions">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((item, index) => {
                                const stt = startIndex + index + 1;
                                const isPending = item.status === 'pending';
                                const isEssayType = item.type === "essay";
                                const itemType = isEssayType ? "Tự luận" : "Trắc nghiệm";

                                return (
                                    <tr key={item._id || index} className="submission-row">
                                        <td className="st-col-id">{stt}</td>
                                        <td className="st-col-name font-medium">{item.userName || item.user?.name || "Khách"}</td>
                                        <td className="st-col-lesson">{item.lessonTitle || item.lesson?.title || "Không rõ"}</td>
                                        <td className="st-col-grade">{item.grade ? `Lớp ${item.grade}` : ""}</td>
                                        <td className="st-col-type">
                                            <span className={`type-badge ${isEssayType ? 'type-essay' : 'type-mcq'}`}>
                                                {itemType}
                                            </span>
                                        </td>
                                        <td className="st-col-score font-bold text-center">
                                            {item.score !== undefined ? Number(item.score).toFixed(2) : "-"}
                                        </td>
                                        <td className="st-col-status text-center">
                                            {isPending ? (
                                                <span className="status-badge status-pending">Chưa chấm</span>
                                            ) : (
                                                <span className="status-badge status-graded">Đã chấm</span>
                                            )}
                                        </td>
                                        <td className="st-col-date text-sm text-gray">{formatDate(item.createdAt)}</td>
                                        <td className="st-col-actions">
                                            <div className="action-buttons">
                                                <button 
                                                    className="action-btn btn-view" 
                                                    title="Xem chi tiết"
                                                    onClick={() => onView && onView(item)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {isPending && (
                                                    <button 
                                                        className="action-btn btn-grade" 
                                                        title="Chấm điểm"
                                                        onClick={() => onGrade && onGrade(item)}
                                                    >
                                                        <CheckSquare size={18} />
                                                    </button>
                                                )}
                                                <button 
                                                    className="action-btn btn-delete" 
                                                    title="Xóa bài làm"
                                                    onClick={() => onDelete && onDelete(item)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="submission-empty">
                                    <div className="empty-message">
                                        <p>Không có dữ liệu bài làm nào.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="submission-pagination">
                    <span className="pagination-info">
                        Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, submissions.length)} trong tổng số {submissions.length} bài
                    </span>
                    <div className="pagination-controls">
                        <button 
                            className="page-btn" 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        <div className="page-numbers">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                    style={{
                                        display: (page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1) ? 'inline-flex' : 'none'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button     
                            className="page-btn" 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionTable;
