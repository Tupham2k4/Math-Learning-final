import React from 'react';
import EmptyCommentState from '../EmptyCommentState/EmptyCommentState';
import CommentTableRow from '../CommentTableRow/CommentTableRow';
import './CommentTable.css';

const CommentTable = ({ comments, currentPage = 1, limit = 10, onView, onDelete }) => {
    return (
        <div className="comment-table-container">
            {comments && comments.length > 0 ? (
                <div className="comment-table-wrapper">
                    <table className="comment-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên học sinh</th>
                                <th>Lớp</th>
                                <th>Nội dung</th>
                                <th>Video bài giảng gốc</th>
                                <th>Ngày bình luận</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment, index) => (
                                <CommentTableRow 
                                    key={comment._id || index}
                                    comment={comment}
                                    index={index}
                                    currentPage={currentPage}
                                    limit={limit}
                                    onView={onView}
                                    onDelete={onDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyCommentState />
            )}
        </div>
    );
};

export default CommentTable;