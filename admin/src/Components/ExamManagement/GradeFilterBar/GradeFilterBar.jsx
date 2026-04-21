import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import './GradeFilterBar.css';

const GradeFilterBar = ({
    selectedGrade,
    setSelectedGrade,
    searchTerm,
    setSearchTerm,
    onAddgrade
}) => {
    //Mảng danh sách khối lớp từ 1 đến 12
    const grades = Array.from({ length: 12 }, (_, index) => index + 1);

    return (
        <div className="grade-filter-bar">
            {/* Cụm trái: Lọc khối và tìm kiếm */}
            <div className="grade-filter-left">
                <div className="grade-grade-wrapper">
                    <Filter size={18} className="grade-grade-icon" />
                    <select
                        className="grade-grade-select"
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

                <div className="grade-search-wrapper">
                    <Search size={18} className="grade-search-icon" />
                    <input
                        type="text"
                        className="grade-search-input"
                        placeholder="Tìm kiếm tên đề"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Cụm phải: Thêm mới */}
            <div className="grade-filter-right">
                <button className="grade-add-btn" onClick={onAddgrade}>
                    <Plus size={18} />
                    <span>Thêm đề</span>
                </button>
            </div>
        </div>
    );
};

export default GradeFilterBar;
