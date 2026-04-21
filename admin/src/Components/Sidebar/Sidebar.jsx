import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  NotebookPen, 
  FileText, 
  CircleHelp, 
  MessageSquare, 
  Video, 
  Save,
  Bot,
  Menu,
  X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { path: '/quan-ly-tai-khoan', icon: <Users size={20} />, text: 'Quản lý người dùng' },
    { path: '/quan-ly-chuong-bai', icon: <BookOpen size={20} />, text: 'Quản lý chương học' },
    { path: '/quan-ly-bai-giang', icon: <NotebookPen size={20} />, text: 'Quản lý bài giảng' },
    { path: '/quan-ly-kho-de', icon: <FileText size={20} />, text: 'Quản lý kho đề' },
    { path: '/quan-ly-bai-tap', icon: <CircleHelp size={20} />, text: 'Quản lý bài tập' },
    { path: '/quan-ly-binh-luan', icon: <MessageSquare size={20} />, text: 'Quản lý bình luận' },
    { path: '/quan-ly-video', icon: <Video size={20} />, text: 'Quản lý video' },
    { path: '/luu-tru-bai-lam', icon: <Save size={20} />, text: 'Lưu trữ bài làm' },
    { path: '/quan-ly-chatbot', icon: <Bot size={20} />, text: 'Quản lý Chatbot AI' },
  ];

  return (
    <>
      {/* Nút Hamburger menu dành cho màn hình nhỏ */}
      <button className="sidebar-mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop mờ khi mở sidebar trên mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-menu">
          {menuItems.map((item, index) => (
            <NavLink 
              to={item.path} 
              key={index} 
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)} 
            >
              <div className="sidebar-icon">{item.icon}</div>
              <span className="sidebar-text">{item.text}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
