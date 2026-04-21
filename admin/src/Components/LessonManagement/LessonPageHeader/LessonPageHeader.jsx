import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './LessonPageHeader.css';

const LessonPageHeader = () => {
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
         // Update giờ và ngày hôm nay
         const interval = setInterval(updateDate, 3600000);
         return () => clearInterval(interval);
       }, []);
     return (
          <div className="Lesson-header-section">
       <div className="Lesson-header-main">
         <div className="Lesson-header-content">
           <h1 className="Lesson-title">Quản lý bài giảng </h1>
           <p className="Lesson-description">
             Thêm, sửa, xóa và quản lý bài giảng 
           </p>
         </div>
         <div className="Lesson-header-widgets">
           <div className="Lesson-greeting-pill">
             <span className="greeting-text">Xin chào,</span>
             <span className="greeting-admin">Admin 👋</span>
           </div>
           <div className="Lesson-date-pill">
             <Calendar className="date-icon" size={16} />
             <span>{currentDate}</span>
           </div>
         </div>
       </div>
     </div>
     );
};

export default LessonPageHeader;
