import React, { useState, useEffect } from 'react';
import { Home, Calendar, LayoutDashboard } from 'lucide-react';
import './DashboardHeader.css';

const DashboardHeader = () => {
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
    <div className="dashboard-header-section">
      <div className="dashboard-header-main">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Trang tổng quan quản trị</h1>
          
          <div className="dashboard-breadcrumb">
            <Home className="breadcrumb-icon" size={16} />
            <span className="breadcrumb-separator">/</span>
            <LayoutDashboard size={14} className="breadcrumb-current-icon" />
            <span className="breadcrumb-current">Dashboard</span>
          </div>

          <p className="dashboard-description">
            Theo dõi số liệu học tập, học sinh và nội dung trên hệ thống
          </p>
        </div>

        <div className="dashboard-header-widgets">
          <div className="dashboard-greeting-pill">
            <span className="greeting-text">Xin chào,</span>
            <span className="greeting-admin">Admin 👋</span>
          </div>
          
          <div className="dashboard-date-pill">
            <Calendar className="date-icon" size={16} />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
