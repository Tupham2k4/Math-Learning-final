import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './ChapterLessonHeader.css';

const ChapterLessonHeader = () => {
    const [currentDate, setCurrentDate] = useState('');
    
      useEffect(() => {
        const updateDate = () => {
          const now = new Date();
          const formattedDate = now.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          setCurrentDate(formattedDate);
        };
    
        updateDate();
        const interval = setInterval(updateDate, 3600000);
        return () => clearInterval(interval);
      }, []);
    return (
         <div className="ChapterLesson-header-section">
      <div className="ChapterLesson-header-main">
        <div className="ChapterLesson-header-content">
          <h1 className="ChapterLesson-title">Quản lý chương, tên bài </h1>
          <p className="ChapterLesson-description">
            Thêm, sửa, xóa và quản lý tên chương và tên bài 
          </p>
        </div>
        <div className="ChapterLesson-header-widgets">
          <div className="ChapterLesson-greeting-pill">
            <span className="greeting-text">Xin chào,</span>
            <span className="greeting-admin">Admin 👋</span>
          </div>
          <div className="ChapterLesson-date-pill">
            <Calendar className="date-icon" size={16} />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>
    </div>
    );
};

export default ChapterLessonHeader;