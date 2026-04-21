import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './VideoPageHeader.css';

const VideoPageHeader = () => {
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
          <div className="Video-header-section">
       <div className="Video-header-main">
         <div className="Video-header-content">
           <h1 className="Video-title">Quản lý video bài giảng </h1>
           <p className="Video-description">
             Thêm, sửa, xóa và quản lý video bài giảng 
           </p>
         </div>
         <div className="Video-header-widgets">
           <div className="Video-greeting-pill">
             <span className="greeting-text">Xin chào,</span>
             <span className="greeting-admin">Admin 👋</span>
           </div>
           <div className="Video-date-pill">
             <Calendar className="date-icon" size={16} />
             <span>{currentDate}</span>
           </div>
         </div>
       </div>
     </div>
     );
};

export default VideoPageHeader;
