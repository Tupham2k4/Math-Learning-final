import React from "react";
import { Search, Filter } from "lucide-react";
import "./StudyFilterBar.css";

const StudyFilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="study-filter-bar">
      {/* Vùng tìm kiếm và lọc */}
      <div className="study-filter-left">
        <div className="study-search-wrapper">
          <Search size={18} className="study-search-icon" />
          <input
            type="text"
            className="study-search-input"
            placeholder="Tìm kiếm tên học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="study-role-wrapper">
          <Filter size={18} className="study-role-icon" />
          <select
            className="study-role-select-1"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Tất cả bài làm</option>
            <option value="mcq">Trắc nghiệm</option>
            <option value="essay">Tự luận</option>
          </select>
          <Filter size={18} className="study-role-icon" />
          <select
            className="study-role-select-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="graded">Đã chấm</option>
            <option value="pending">Chưa chấm</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudyFilterBar;
