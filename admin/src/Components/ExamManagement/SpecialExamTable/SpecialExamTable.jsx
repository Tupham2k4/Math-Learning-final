import React from 'react';
import './SpecialExamTable.css';
import SpecialExamTableRow from '../SpecialExamTableRow/SpecialExamTableRow';

const SpecialExamTable = ({ exams, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    // Hiển thị trạng thái trống nếu không có dữ liệu
    if (!exams || exams.length === 0) {
        return (
            <div className="empty-exam-state">
                <img src="/empty-state.svg" alt="No data" className="empty-exam-img" onError={(e) => e.target.style.display = 'none'} />
                <h3>Chưa có đề đặc biệt nào!</h3>
                <p>Hãy thêm đề thi đặc biệt mới cho hệ thống.</p>
            </div>
        );
    }

    return (
        <div className="exam-table-wrapper">
            <table className="exam-table special-exam-table">
                <thead>
                    <tr>
                        <th className="th-stt">STT</th>
                        <th className="th-name">Tên đề</th>
                        <th className="th-category" style={{ width: '40%' }}>Loại đề</th>
                        <th className="th-actions">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam, index) => (
                        <SpecialExamTableRow 
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

export default SpecialExamTable;
