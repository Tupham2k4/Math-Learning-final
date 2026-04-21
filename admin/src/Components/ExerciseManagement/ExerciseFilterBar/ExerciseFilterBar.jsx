import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import './ExerciseFilterBar.css';
const ExerciseFilterBar = ({
    selectedGrade,
    setSelectedGrade,
    searchItem,
    setSearchItem,
    onAddExercise
}) => {
    //Mảng danh sách khối lớp từ 1 đến 12
    const grades = Array.from({length: 12}, (_,index) => index + 1);
    return (
        <div className="exercise-filter-bar">
           <div className="exercise-filter-left">
            <div className="exercise-grade-wrapper">
                <Filter size={18} className='exercise-grade-icon'/>
                <select
                        className="exercise-grade-select"
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
            <div className="exercise-search-wrapper">
                <Search size={18} className='exercise-search-icon'/>
                <input
                    type="text"
                    placeholder="Tìm kiếm bài tập..."
                    className="exercise-search-input"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                />
            </div>
        </div> 
        <div className="exercise-filter-right">
              <button className="exercise-add-btn" onClick={onAddExercise}>
                <Plus size={18} />
                <span>Thêm bài tập</span>
              </button>
        </div>
    </div>
    );
};
export default ExerciseFilterBar;
