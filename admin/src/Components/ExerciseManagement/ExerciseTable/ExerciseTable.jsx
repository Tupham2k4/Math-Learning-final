import React from 'react';
import './ExerciseTable.css';
import ExerciseTableRow from '../ExerciseTableRow/ExerciseTableRow';
import EmptyExerciseState from '../EmptyExerciseState/EmptyExerciseState';

const ExerciseTable = ({ exercises, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    // Hiển thị trạng thái trống nếu không có dữ liệu
    if (!exercises || exercises.length === 0) {
        return <EmptyExerciseState />;
    }

    return (
        <div className="exercise-table-wrapper">
            <table className="exercise-table">
                <thead>
                    <tr>
                        <th className="th-stt">STT</th>
                        <th className="th-name">Tên bài tập</th>
                        <th className="th-grade">Lớp</th>
                        <th className="th-chapter">Tên chương</th>
                        <th className="th-type">Loại</th>
                        <th className="th-actions">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise, index) => (
                        <ExerciseTableRow 
                            key={exercise._id || index}
                            lesson={exercise}
                            index={index}
                            currentPage={currentPage}
                            limit={limit}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExerciseTable;