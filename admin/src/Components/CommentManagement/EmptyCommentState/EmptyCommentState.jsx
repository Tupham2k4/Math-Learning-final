import React from 'react';
import { BookOpen } from 'lucide-react';
import './EmptyCommentState.css';

const EmptyCommentState = () => {
    return (
        <div className="comment-empty-state">
            <div className="comment-empty-icon-wrapper">
                <BookOpen size={48} />
            </div>
            <h3>Không tìm thấy bình luận nào</h3>
            <p>Hãy thử thay đổi khối lớp, từ khóa hoặc thêm bình luận mới.</p>
        </div>
    );
};

export default EmptyCommentState;
