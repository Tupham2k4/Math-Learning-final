import React from 'react';
import { BookOpen } from 'lucide-react';
import './EmptyLessonState.css';

const EmptyLessonState = () => {
    return (
        <div className="lesson-empty-state">
            <div className="lesson-empty-icon-wrapper">
                <BookOpen size={48} />
            </div>
            <h3>Không tìm thấy bài giảng nào</h3>
            <p>Hãy thử thay đổi khối lớp, từ khóa hoặc thêm bài giảng mới.</p>
        </div>
    );
};

export default EmptyLessonState;
