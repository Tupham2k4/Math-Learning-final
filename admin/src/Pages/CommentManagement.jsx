import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentPageHeader from '../Components/CommentManagement/CommentPageHeader/CommentPageHeader';
import CommentTable from '../Components/CommentManagement/CommentTable/CommentTable';
import CommentDetailModal from '../Components/CommentManagement/CommentDetailModal/CommentDetailModal';
import DeleleCommentModal from '../Components/CommentManagement/DeleleCommentModal/DeleleCommentModal';

const CommentManagement = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho Modal Xem Chi Tiết
    const [selectedComment, setSelectedComment] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // State cho Modal Xác Chọn Xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                // Fetch tất cả comment từ backend
                const response = await axios.get('http://localhost:4000/api/comments');
                if (response.data.success) {
                    setComments(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải bình luận:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    // Handle click button xóa (mở modal)
    const handleDeleteClick = (commentId) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    // Confirm xóa comment thực tế
    const handleConfirmDelete = async () => {
        if (!commentToDelete) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/comments/${commentToDelete}`, {
                headers: { 'auth-token': token }
            });
            setComments(comments.filter(c => c._id !== commentToDelete));
            setIsDeleteModalOpen(false);
            setCommentToDelete(null);
        } catch (error) {
            console.error('Lỗi khi xóa bình luận:', error);
            alert('Không thể xóa bình luận này!');
        }
    };
    
    // Mở Detail Modal
    const handleViewDetail = (comment) => {
        setSelectedComment(comment);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="comment-management-container" style={{ padding: '24px' }}>
            <CommentPageHeader />
            <div style={{ marginTop: '24px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Đang tải bình luận...</p>
                ) : (
                    <CommentTable 
                        comments={comments} 
                        onView={handleViewDetail}
                        onDelete={handleDeleteClick}
                    />
                )}
            </div>
            
            <CommentDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                lesson={selectedComment}
            />

            <DeleleCommentModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default CommentManagement;