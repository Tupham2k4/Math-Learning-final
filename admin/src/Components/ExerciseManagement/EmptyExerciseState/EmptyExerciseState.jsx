import React from 'react';
import { BookOpen } from 'lucide-react';
import './EmptyExerciseState.css';

const EmptyExerciseState = () => {
    return (
        <div className="exercise-empty-state">
            <div className="exercise-empty-icon-wrapper">
                <BookOpen size={48} />
            </div>
            <h3>Không tìm thấy bài tập nào</h3>
            <p>Hãy thử thay đổi khối lớp, từ khóa hoặc thêm bài tập mới.</p>
        </div>
    );
};

export default EmptyExerciseState;
