import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './AccountHeader.css';

const AccountHeader = () => {
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
        // update ngày và giờ hiện tại
        const interval = setInterval(updateDate, 3600000);
        return () => clearInterval(interval);
      }, []);
    return (
        <div className="account-header-section">
            <div className="account-header-main">
                <div className="account-header-content">
                    <h1 className="account-title">Trang quản lý người dùng</h1>
                    <p className="account-description">
                        Thêm, sửa, xóa và quản lý tài khoản
                    </p>
                </div>
                <div className="account-header-widgets">
                    <div className="account-greeting-pill">
                        <span className="greeting-text">Xin chào,</span>
                        <span className="greeting-admin">Admin 👋</span>
                    </div>
                    <div className="account-date-pill">
                        <Calendar className="date-icon" size={16} />
                        <span>{currentDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountHeader;