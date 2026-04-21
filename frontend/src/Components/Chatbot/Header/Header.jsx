import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Header = ({ onNewChat }) => {
  return (
    <div className="header">
      <div className="breadcrumb">
        <Link to="/" className="home-link">
          Trang chủ
        </Link>
        <span className="separator"> ⟶ </span>
        <span className="current">Chatbot</span>
      </div>
      
      <div 
        className="header-content" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '16px'
        }}
      >
        <div>
          <h1>Trợ lý AI giải đáp toán học</h1>
          <p>Đặt câu hỏi về toán, nhận giải thích chi tiết từng bước và hướng dẫn cách giải</p>
        </div>
        
        <button 
          className="new-chat-header-btn"
          onClick={onNewChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#3A9D5D',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(58, 157, 93, 0.2)'
          }}
        >
          <Plus size={18} />
          Cuộc trò chuyện mới
        </button>
      </div>
    </div>
  );
};

export default Header;
