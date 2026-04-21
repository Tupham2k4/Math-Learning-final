import React from 'react';
import { BookOpen } from 'lucide-react';
import './EmptyVideoState.css';

const EmptyVideoState = () => {
    return (
        <div className="video-empty-state">
            <div className="video-empty-icon-wrapper">
                <BookOpen size={48} />
            </div>
            <h3>Không tìm thấy video bài giảng nào</h3>
            <p>Hãy thử thay đổi khối lớp, từ khóa hoặc thêm video bài giảng mới.</p>
        </div>
    );
};

export default EmptyVideoState;
