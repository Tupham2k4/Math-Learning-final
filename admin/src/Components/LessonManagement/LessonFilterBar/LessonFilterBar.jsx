import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import './LessonFilterBar.css';

const LessonFilterBar = ({
    selectedGrade,
    setSelectedGrade,
    searchTerm,
    setSearchTerm,
    onAddLesson
}) => {
    //Mảng danh sách khối lớp từ 1 đến 12
    const grades = Array.from({ length: 12 }, (_, index) => index + 1);

    return (
        <div className="lesson-filter-bar">
            {/* Cụm trái: Lọc khối và tìm kiếm */}
            <div className="lesson-filter-left">
                <div className="lesson-grade-wrapper">
                    <Filter size={18} className="lesson-grade-icon" />
                    <select
                        className="lesson-grade-select"
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                    >
                        <option value="">Tất cả khối</option>
                        {grades.map(grade => (
                            <option key={grade} value={grade}>
                                Khối {grade}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="lesson-search-wrapper">
                    <Search size={18} className="lesson-search-icon" />
                    <input
                        type="text"
                        className="lesson-search-input"
                        placeholder="Tìm kiếm tên bài giảng"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Cụm phải: Thêm mới */}
            <div className="lesson-filter-right">
                <button className="lesson-add-btn" onClick={onAddLesson}>
                    <Plus size={18} />
                    <span>Thêm bài giảng</span>
                </button>
            </div>
        </div>
    );
};

export default LessonFilterBar;
