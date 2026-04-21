import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './ExamPageHeader.css';

const ExamPageHeader = () => {
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
          <div className="exam-header-section">
       <div className="exam-header-main">
         <div className="exam-header-content">
           <h1 className="exam-title">Quản lý kho đề </h1>
           <p className="exam-description">
             Thêm, sửa, xóa và quản lý kho đề 
           </p>
         </div>
         <div className="exam-header-widgets">
           <div className="exam-greeting-pill">
             <span className="greeting-text">Xin chào,</span>
             <span className="greeting-admin">Admin 👋</span>
           </div>
           <div className="exam-date-pill">
             <Calendar className="date-icon" size={16} />
             <span>{currentDate}</span>
           </div>
         </div>
       </div>
     </div>
     );
};

export default ExamPageHeader;
