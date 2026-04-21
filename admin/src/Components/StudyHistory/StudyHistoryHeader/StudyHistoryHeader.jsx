import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './StudyHistoryHeader.css';

const StudyHistoryHeader = () => {
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
          <div className="Study-header-section">
       <div className="Study-header-main">
         <div className="Study-header-content">
           <h1 className="Study-title">Lưu trữ bài làm </h1>
           <p className="Study-description">
             Xem lại các bài làm của học sinh 
           </p>
         </div>
         <div className="Study-header-widgets">
           <div className="Study-greeting-pill">
             <span className="greeting-text">Xin chào,</span>
             <span className="greeting-admin">Admin 👋</span>
           </div>
           <div className="Study-date-pill">
             <Calendar className="date-icon" size={16} />
             <span>{currentDate}</span>
           </div>
         </div>
       </div>
     </div>
     );
};

export default StudyHistoryHeader;
