import React from 'react';
import './NormalExamTable.css';
import NormalExamTableRow from '../NormalExamTableRow/NormalExamTableRow';

const NormalExamTable = ({ exams, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    // Hiển thị trạng thái trống nếu không có dữ liệu
    if (!exams || exams.length === 0) {
        return (
            <div className="empty-exam-state">
                <img src="/empty-state.svg" alt="No data" className="empty-exam-img" onError={(e) => e.target.style.display = 'none'} />
                <h3>Chưa có đề nào!</h3>
                <p>Hãy thêm đề thi mới cho chương này.</p>
            </div>
        );
    }

    return (
        <div className="exam-table-wrapper">
            <table className="exam-table">
                <thead>
                    <tr>
                        <th className="th-stt">STT</th>
                        <th className="th-name">Tên đề</th>
                        <th className="th-grade">Lớp</th>
                        <th className="th-chapter">Chương</th>
                        <th className="th-actions">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam, index) => (
                        <NormalExamTableRow 
                            key={exam._id || index}
                            exam={exam}
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

export default NormalExamTable;
