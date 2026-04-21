import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import './VideoFilterBar.css';

const VideoFilterBar = ({
    selectedGrade,
    setSelectedGrade,
    searchTerm,
    setSearchTerm,
    onAddVideo
}) => {
    const grades = Array.from({length: 12}, (_,index) => index + 1);
    return (
        <div className="video-filter-bar">
                   {/* Cụm trái: Lọc khối và tìm kiếm */}
                   <div className="video-filter-left">
                       <div className="video-grade-wrapper">
                           <Filter size={18} className="video-grade-icon" />
                           <select
                               className="video-grade-select"
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
       
                       <div className="video-search-wrapper">
                           <Search size={18} className="video-search-icon" />
                           <input
                               type="text"
                               className="video-search-input"
                               placeholder="Tìm kiếm tên video"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                           />
                       </div>
                   </div>
       
                   {/* Cụm phải: Thêm mới */}
                   <div className="video-filter-right">
                       <button className="video-add-btn" onClick={onAddVideo}>
                           <Plus size={18} />
                           <span>Thêm video</span>
                       </button>
                   </div>
        </div>
    );
};

export default VideoFilterBar;