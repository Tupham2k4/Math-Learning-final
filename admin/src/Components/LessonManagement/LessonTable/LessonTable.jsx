import React from 'react';
import EmptyLessonState from '../EmptyLessonState/EmptyLessonState';
import LessonTableRow from '../LessonTableRow/LessonTableRow';
import './LessonTable.css';

const LessonTable = ({ lessons, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    return (
        <div className="lesson-table-container">
            {lessons && lessons.length > 0 ? (
                <div className="lesson-table-wrapper">
                    <table className="lesson-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên bài giảng</th>
                                <th>Lớp</th>
                                <th>Tên chương</th>
                                <th>Ngày tạo</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((lesson, index) => (
                                <LessonTableRow 
                                    key={lesson._id || index}
                                    lesson={lesson}
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
            ) : (
                <EmptyLessonState />
            )}
        </div>
    );
};

export default LessonTable;
