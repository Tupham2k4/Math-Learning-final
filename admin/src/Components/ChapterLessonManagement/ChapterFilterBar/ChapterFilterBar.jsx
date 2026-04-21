import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import './ChapterFilterBar.css';

const ChapterFilterBar = ({ 
    selectedGrade, 
    onGradeChange, 
    searchTerm, 
    onSearchChange,
    onAddChapter,
    onAddLesson
}) => {
    
    // Mảng danh sách các khối lớp từ 1 đến 12
    const grades = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="chapter-filter-bar">
            
            {/* Cụm Tìm kiếm và Filter bên trái */}
            <div className="filter-left-section">
                
                {/* Input Tìm kiếm */}
                <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên chương, tên bài..." 
                        className="chapter-search-input"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Dropdown Lọc khối */}
                <div className="grade-filter-wrapper">
                    <Filter size={18} className="filter-icon" />
                    <select 
                        className="grade-select"
                        value={selectedGrade}
                        onChange={(e) => onGradeChange(e.target.value)}
                    >
                        <option value="">Tất cả khối</option>
                        {grades.map(grade => (
                            <option key={grade} value={`Lớp ${grade}`}>
                                Khối {grade}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cụm Nút thêm mới bên phải */}
            <div className="filter-right-section">
                <button 
                    className="action-btn add-chapter-btn"
                    onClick={onAddChapter}
                >
                    <Plus color='white' size={18} />
                    <span>Thêm chương</span>
                </button>

                <button 
                    className="action-btn add-lesson-btn"
                    onClick={onAddLesson}
                >
                    <Plus color='white' size={18} />
                    <span>Thêm bài</span>
                </button>
            </div>
            
        </div>
    );
};

export default ChapterFilterBar;
