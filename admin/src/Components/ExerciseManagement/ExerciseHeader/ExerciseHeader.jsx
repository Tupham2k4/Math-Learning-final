import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './ExerciseHeader.css';

const ExerciseHeader = () => {
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
          <div className="Exercise-header-section">
       <div className="Exercise-header-main">
         <div className="Exercise-header-content">
           <h1 className="Exercise-title">Quản lý bài tập </h1>
           <p className="Exercise-description">
             Thêm, sửa, xóa và quản lý bài tập 
           </p>
         </div>
         <div className="Exercise-header-widgets">
           <div className="Exercise-greeting-pill">
             <span className="greeting-text">Xin chào,</span>
             <span className="greeting-admin">Admin 👋</span>
           </div>
           <div className="Exercise-date-pill">
             <Calendar className="date-icon" size={16} />
             <span>{currentDate}</span>
           </div>
         </div>
       </div>
     </div>
     );
};

export default ExerciseHeader;
