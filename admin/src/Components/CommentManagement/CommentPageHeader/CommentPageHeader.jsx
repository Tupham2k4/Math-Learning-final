import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './CommentPageHeader.css';

const CommentPageHeader = () => {
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
          <div className="Comment-header-section">
       <div className="Comment-header-main">
         <div className="Comment-header-content">
           <h1 className="Comment-title">Quản lý bình luận </h1>
           <p className="Comment-description">
             Thêm, sửa, xóa và quản lý bình luận 
           </p>
         </div>
         <div className="Comment-header-widgets">
           <div className="Comment-greeting-pill">
             <span className="greeting-text">Xin chào,</span>
             <span className="greeting-admin">Admin 👋</span>
           </div>
           <div className="Comment-date-pill">
             <Calendar className="date-icon" size={16} />
             <span>{currentDate}</span>
           </div>
         </div>
       </div>
     </div>
     );
};

export default CommentPageHeader;
